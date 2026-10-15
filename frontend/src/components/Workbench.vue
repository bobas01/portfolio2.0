<script setup>
import { computed, nextTick, ref } from "vue";
import GroveScene from "./GroveScene.vue";
import { textFor } from "../copy.js";
import { benchSkills, projects, sentenceFor, shotAt, skillLit } from "../works.js";

const props = defineProps({
  localeId: { type: String, required: true },
  backLabel: { type: String, default: "" },
});

defineEmits(["grove"]);

const hovered = ref("");
const selected = ref(0);
const shown = ref(0);
const turn = ref(null);
const shotIndex = ref({});
let turnToken = 0;
let swipeX = 0;
let tracking = false;

const activeId = computed(() => hovered.value || projects[selected.value]?.id || "");
const page = computed(() => projects[shown.value]);

function t(key) {
  return textFor(props.localeId, key);
}

function lit(skillId) {
  return skillLit(activeId.value, skillId);
}

function enter(id) {
  hovered.value = id;
}

function leave() {
  hovered.value = "";
}

async function openProject(position) {
  if (!Number.isInteger(position) || position < 0 || position >= projects.length) return;
  hovered.value = "";
  if (turn.value && turn.value.to !== position) {
    shown.value = turn.value.to;
    turn.value = null;
    await nextTick();
  } else if (turn.value) {
    return;
  }
  if (position === shown.value) {
    selected.value = position;
    return;
  }
  selected.value = position;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const narrow = window.matchMedia?.("(max-width: 700px)")?.matches ?? false;
  if (reduce || narrow) {
    shown.value = position;
    return;
  }
  turnToken += 1;
  turn.value = {
    token: turnToken,
    face: position,
    to: position,
  };
}

function finishTurn(event) {
  if (!turn.value || event.target !== event.currentTarget) return;
  shown.value = turn.value.to;
  turn.value = null;
}

function swipeStart(event) {
  if (event.target.closest("button, a, select")) return;
  tracking = true;
  swipeX = event.clientX;
}

function swipeEnd(event) {
  if (!tracking) return;
  tracking = false;
  const delta = event.clientX - swipeX;
  if (Math.abs(delta) < 48) return;
  openProject(shown.value + (delta < 0 ? 1 : -1));
}

function stepShot(project, delta) {
  const current = shotIndex.value[project.id] ?? 0;
  shotIndex.value = { ...shotIndex.value, [project.id]: current + delta };
}

</script>

<template>
  <div class="bench">
    <GroveScene class="bench-ground" />
    <header class="bench-bar">
      <button type="button" class="back" @click="$emit('grove')">
        {{ backLabel || t("grove") }}
      </button>
      <p class="who">{{ t("title") }}</p>
      <slot name="languages" />
    </header>

    <div class="atelier">
      <ul class="skills hud" :aria-label="t('toolsLabel')">
        <li
          v-for="skill in benchSkills"
          :key="skill.id"
          class="slot"
          :class="{ 'is-lit': lit(skill.id) }"
          :style="{ '--led': skill.led }"
        >
          <img :src="skill.logo" :alt="skill.name" />
          <span>{{ skill.name }}</span>
        </li>
      </ul>

        <div class="manual">
          <div class="spread">
            <div class="leaf" @pointerdown="swipeStart" @pointerup="swipeEnd" @pointercancel="swipeEnd">
              <svg class="sprig" viewBox="0 0 120 240" aria-hidden="true">
                <path d="M36 2c4 36-8 58 2 96 10 36-6 58 4 92 6 22 0 32 6 46" fill="none" stroke="#2f6b40" stroke-width="2.4" stroke-linecap="round"/>
                <path d="M36 28c22-18 42-8 38 8-16 4-28 8-38 18 4-10 4-18 0-26z" fill="#3f8f52"/>
                <path d="M34 36c-20-8-36 2-34 16 14 2 24 8 34 16-2-12-2-22 0-32z" fill="#24683a"/>
                <path d="M40 78c24-16 44-4 40 12-18 2-30 8-40 18 2-12 2-20 0-30z" fill="#57a364"/>
                <path d="M36 92c-22-10-40 0-38 16 16 2 28 8 38 18 0-12 0-22 0-34z" fill="#1f5c34"/>
                <path d="M42 132c20-14 38-2 34 12-14 2-24 8-34 16 2-10 2-18 0-28z" fill="#3f8f52"/>
                <path d="M34 146c-18-8-32 2-30 14 12 2 22 6 30 14 0-10 0-18 0-28z" fill="#2d7a44"/>
                <path d="M44 186c16-12 30-2 26 10-12 2-20 6-26 14 0-8 0-16 0-24z" fill="#67b072"/>
                <path d="M40 214c-16-6-28 2-26 12 10 2 18 6 26 12 0-8 0-16 0-24z" fill="#2d7a44"/>
                <path d="M46 228c14-8 26 0 22 10-10 2-16 4-22 10 0-8 0-14 0-20z" fill="#3f8f52"/>
                <circle cx="58" cy="58" r="3.2" fill="#f2d56b"/>
                <circle cx="22" cy="118" r="2.6" fill="#f2d56b"/>
              </svg>
              <article class="sheet">
                <h2>{{ page.name }}</h2>
                <figure>
                  <img :src="shotAt(page, shotIndex[page.id] ?? 0)" :alt="page.name" />
                  <div v-if="page.shots.length > 1" class="shot-nav">
                    <button type="button" @click.stop="stepShot(page, -1)">‹</button>
                    <button type="button" @click.stop="stepShot(page, 1)">›</button>
                  </div>
                </figure>
                <p>{{ sentenceFor(page, localeId) }}</p>
              </article>
              <div
                v-if="turn"
                :key="turn.token"
                class="curl"
                aria-hidden="true"
                @animationend="finishTurn"
              >
                <article class="sheet">
                  <h2>{{ projects[turn.face].name }}</h2>
                  <figure>
                    <img
                      :src="shotAt(projects[turn.face], shotIndex[projects[turn.face].id] ?? 0)"
                      alt=""
                    />
                  </figure>
                  <p>{{ sentenceFor(projects[turn.face], localeId) }}</p>
                </article>
              </div>
            </div>
            <nav class="index" :aria-label="t('travaux')">
              <button
                v-for="(project, position) in projects"
                :key="project.id"
                type="button"
                class="entry"
                :class="{ 'is-open': selected === position }"
                :aria-current="selected === position ? 'true' : undefined"
                @mouseenter="enter(project.id)"
                @mouseleave="leave"
                @focus="enter(project.id)"
                @blur="leave"
                @click="openProject(position)"
              >
                {{ project.name }}
              </button>
            </nav>
            <label class="picker">
              {{ t("travaux") }}
              <select :value="selected" @change="openProject(Number($event.target.value))">
                <option v-for="(project, position) in projects" :key="project.id" :value="position">
                  {{ project.name }}
                </option>
              </select>
            </label>
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.bench {
  position: relative;
  width: 100%;
  min-height: 100%;
  color: #1a1208;
}

.bench-ground {
  position: fixed;
  z-index: 0;
  inset: 0;
  pointer-events: none;
}

.bench-bar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.25rem 0.2rem;
  background: transparent;
}

.back,
.who {
  margin: 0;
  font-family: "Josefin Slab", serif;
  font-weight: 700;
}

.back {
  min-height: 2.5rem;
  padding: 0.2rem 0.7rem;
  border: 3px solid #163628;
  outline: 2px solid #8fd18a;
  outline-offset: -5px;
  background: #0b1c14;
  color: #d7f0c4;
  box-shadow: 0 3px 0 #06140c;
  font-size: 1rem;
  cursor: pointer;
}

.back:hover {
  color: #f4ffe8;
  border-color: #8fd18a;
}

.who {
  color: #0a371a;
  font-size: clamp(1.35rem, 2vw, 1.9rem);
  text-shadow:
    0 1px 0 #f4ffe8,
    1px 0 0 #f4ffe8;
}

.atelier {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 0 1rem 1.4rem;
}

.hud {
  display: grid;
  grid-template-columns: repeat(7, 3.55rem);
  gap: 4px;
  width: max-content;
  max-width: 94vw;
  margin: 0;
  padding: 8px;
  list-style: none;
  background: #0b1c14;
  border: 4px solid #163628;
  outline: 2px solid #8fd18a;
  outline-offset: -6px;
  box-shadow: 0 4px 0 #06140c;
}

.slot {
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 0.2rem;
  min-height: 4.35rem;
  margin: 0;
  padding: 0.35rem 0.1rem 0.28rem;
  background: #10281c;
  color: #d7f0c4;
  font-family: "Josefin Slab", serif;
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  border: 2px solid #1d4a32;
}

.slot img {
  width: 2.35rem;
  height: 2.35rem;
  object-fit: contain;
}

.slot.is-lit {
  border-color: var(--led);
  background: #143528;
  box-shadow: inset 0 0 0 1px var(--led);
}

.manual {
  position: relative;
  width: min(46rem, 92vw);
  padding: 12px 16px 22px;
  background: #5a321c;
}

.manual::after {
  content: "";
  position: absolute;
  z-index: 0;
  left: 14px;
  right: 14px;
  bottom: 5px;
  height: 14px;
  background: repeating-linear-gradient(
    to bottom,
    #f6efe2 0 2px,
    #c9b08a 2px 3px
  );
}

.spread {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 0.78fr 1.22fr;
  min-height: 24rem;
  background: #f4ecda;
  box-shadow: 0 0 0 3px #3a2414;
}

.spread::before {
  content: "";
  position: absolute;
  z-index: 6;
  top: 0;
  bottom: 0;
  left: 59.5%;
  width: 14px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, transparent, rgb(74 48 24 / 22%), transparent);
  pointer-events: none;
}

.leaf {
  position: relative;
  min-height: 22rem;
  perspective: 1600px;
  background: #f3ead6;
}

.sprig {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 33%;
  height: 66%;
  pointer-events: none;
}

.index {
  position: relative;
  z-index: 5;
  min-height: 0;
  background: #f3ead6;
  box-shadow: inset 10px 0 14px rgb(90 64 32 / 14%);
}

.sheet {
  box-sizing: border-box;
  min-height: 100%;
  padding: 0.85rem 1rem 1rem 34%;
  background: #f3ead6;
  color: #1a1208;
}

.curl {
  position: absolute;
  z-index: 4;
  inset: 0;
  transform-origin: right center;
  transform: rotateY(-158deg);
  background: #f4ecda;
  pointer-events: none;
  backface-visibility: hidden;
  animation: settle 1.15s cubic-bezier(0.16, 0.7, 0.2, 1) forwards;
}

@keyframes settle {
  0% {
    transform: rotateY(-158deg);
  }
  62% {
    transform: rotateY(-28deg);
    box-shadow: -18px 12px 22px rgb(28 16 8 / 28%);
  }
  100% {
    transform: rotateY(0deg);
    box-shadow: -2px 0 0 #d9c7a2;
  }
}

.sheet h2,
.index {
  font-family: "Josefin Slab", serif;
}

.sheet h2 {
  margin: 0 0 0.45rem;
  font-size: 1.7rem;
  font-weight: 700;
  line-height: 1;
}

.sheet figure {
  margin: 0;
}

.sheet img {
  display: block;
  width: 100%;
  max-height: 11rem;
  object-fit: cover;
  background: #1a1208;
}

.sheet p {
  margin: 0.55rem 0 0;
  max-width: 42ch;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.3;
}

.picker {
  display: none;
}

.index {
  order: -1;
  display: flex;
  flex-direction: column;
  padding: 0.45rem;
}

.entry {
  flex: 1;
  border: 0;
  border-bottom: 1px solid #e0d3b8;
  background: transparent;
  color: #1a1208;
  font-family: "Josefin Slab", serif;
  font-size: 1.35rem;
  font-weight: 700;
  text-align: left;
  padding: 0.2rem 0.7rem;
  cursor: pointer;
}

.entry.is-open {
  background: #e5f0df;
  color: #145c28;
}

.shot-nav {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.3rem;
}

.shot-nav button {
  min-width: 2rem;
  min-height: 2rem;
  border: 0;
  background: #b5e2f7;
  color: #0a371a;
  font-family: "Josefin Slab", serif;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
}

.back:focus-visible,
.entry:focus-visible,
.shot-nav button:focus-visible {
  outline: 3px solid #0a371a;
  outline-offset: 2px;
}

@media (max-width: 700px) {
  .picker {
    display: grid;
    gap: 0.35rem;
    width: min(46rem, 92vw);
    color: #f4ecda;
    font-family: "Josefin Slab", serif;
    font-size: 1.05rem;
    font-weight: 700;
  }

  .picker select {
    min-height: 2.8rem;
    padding: 0.35rem 0.6rem;
    border: 3px solid #3a2414;
    background: #f4ecda;
    color: #1a1208;
    font: inherit;
  }

  .index {
    display: none;
  }

  .hud {
    grid-template-columns: repeat(5, 3.15rem);
  }

  .slot img {
    width: 2rem;
    height: 2rem;
  }

  .spread {
    grid-template-columns: 1fr;
  }

  .leaf {
    min-height: 18rem;
  }

  .sprig {
    width: 28%;
    height: 42%;
  }

  .sheet {
    padding-left: 30%;
  }

  .entry {
    font-size: 1.15rem;
    min-height: 2.6rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .slot,
  .curl {
    transform: none;
    animation: none;
  }
}
</style>
