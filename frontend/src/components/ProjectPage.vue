<script setup>
import { computed, ref, watch } from "vue";
import GroveScene from "./GroveScene.vue";
import { textFor } from "../copy.js";
import { listFor, localized, neighbours, sentenceFor, shotAt, stackFor } from "../works.js";

const props = defineProps({
  project: { type: Object, required: true },
  localeId: { type: String, required: true },
});

defineEmits(["back", "open"]);

const index = ref(0);
const direction = ref("next");
let grabX = null;

const shots = computed(() => (Array.isArray(props.project.shots) ? props.project.shots : []));
const shot = computed(() => shotAt(props.project, index.value));
const position = computed(() => {
  const count = shots.value.length;
  return count ? ((index.value % count) + count) % count : 0;
});
const story = computed(() => localized(props.project.story, props.localeId) || sentenceFor(props.project, props.localeId));
const note = computed(() => localized(props.project.note, props.localeId));
const built = computed(() => listFor(props.project, "features", props.localeId));
const stack = computed(() => stackFor(props.project));
const around = computed(() => neighbours(props.project.id));
const facts = computed(() =>
  [
    ["factKind", localized(props.project.kind, props.localeId)],
    ["factTeam", localized(props.project.team, props.localeId)],
    ["factLength", localized(props.project.length, props.localeId)],
    ["factYear", props.project.year ? String(props.project.year) : ""],
  ].filter(([, value]) => value),
);

function t(key) {
  return textFor(props.localeId, key);
}

function step(delta) {
  if (shots.value.length < 2) return;
  direction.value = delta < 0 ? "prev" : "next";
  index.value += delta;
}

function show(target) {
  if (target === position.value) return;
  direction.value = target < position.value ? "prev" : "next";
  index.value = target;
}

function onKey(event) {
  if (event.key === "ArrowLeft") step(-1);
  else if (event.key === "ArrowRight") step(1);
  else return;
  event.preventDefault();
}

function grab(event) {
  if (event.target.closest("button")) return;
  grabX = event.clientX;
}

function release(event) {
  if (grabX == null) return;
  const delta = event.clientX - grabX;
  grabX = null;
  if (Math.abs(delta) >= 40) step(delta < 0 ? 1 : -1);
}

function dropGrab() {
  grabX = null;
}

watch(
  () => props.project.id,
  () => {
    index.value = 0;
    direction.value = "next";
  },
);
</script>

<template>
  <div class="dossier-page">
    <GroveScene class="dossier-ground" />
    <header class="dossier-bar">
      <button type="button" class="back" @click="$emit('back')">
        <span aria-hidden="true">‹</span> {{ t("travaux") }}
      </button>
      <slot name="languages" />
    </header>

    <article :key="project.id" class="dossier">
      <header class="dossier-head">
        <p class="kind">
          {{ localized(project.kind, localeId) }}<template v-if="project.year"> · {{ project.year }}</template>
        </p>
        <h1>{{ project.name }}</h1>
        <p class="pitch">{{ sentenceFor(project, localeId) }}</p>
        <p class="status" :class="`is-${project.status}`">
          <span class="led" aria-hidden="true"></span>
          {{ t(`status_${project.status}`) }}
        </p>
      </header>

      <section class="screen" :aria-label="t('gallery')">
        <div
          class="frame"
          :tabindex="shots.length > 1 ? 0 : undefined"
          @keydown="onKey"
          @pointerdown="grab"
          @pointerup="release"
          @pointercancel="dropGrab"
        >
          <Transition :name="`shot-${direction}`">
            <img
              :key="shot"
              :src="shot"
              :alt="`${project.name} · ${t('shotLabel')} ${position + 1} / ${shots.length}`"
              draggable="false"
            />
          </Transition>
          <template v-if="shots.length > 1">
            <button type="button" class="turn is-prev" :aria-label="t('prev')" @click="step(-1)">‹</button>
            <button type="button" class="turn is-next" :aria-label="t('next')" @click="step(1)">›</button>
            <p class="counter" aria-live="polite">{{ position + 1 }} / {{ shots.length }}</p>
          </template>
        </div>
        <ol v-if="shots.length > 1" class="thumbs">
          <li v-for="(src, at) in shots" :key="src">
            <button
              type="button"
              :aria-label="`${t('shotLabel')} ${at + 1}`"
              :aria-current="at === position ? 'true' : undefined"
              @click="show(at)"
            >
              <img :src="src" alt="" draggable="false" />
            </button>
          </li>
        </ol>
      </section>

      <div class="dossier-body">
        <div class="story">
          <p>{{ story }}</p>
          <p v-if="note" class="note">{{ note }}</p>
          <template v-if="built.length">
            <h2>{{ t("built") }}</h2>
            <ul class="built">
              <li v-for="item in built" :key="item">{{ item }}</li>
            </ul>
          </template>
        </div>

        <aside class="facts">
          <dl>
            <div v-for="[key, value] in facts" :key="key">
              <dt>{{ t(key) }}</dt>
              <dd>{{ value }}</dd>
            </div>
            <div>
              <dt>{{ t("factStatus") }}</dt>
              <dd>{{ t(`status_${project.status}`) }}</dd>
            </div>
          </dl>
          <h2>{{ t("stack") }}</h2>
          <ul class="chips">
            <li v-for="(item, at) in stack" :key="item.name" :style="{ '--i': at }">
              <img v-if="item.logo" :src="item.logo" alt="" />
              {{ item.name }}
            </li>
          </ul>
          <a
            v-if="project.demo"
            class="demo"
            :href="project.demo"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ t("openSite") }} <span aria-hidden="true">↗</span>
          </a>
        </aside>
      </div>

      <nav class="sequel" :aria-label="t('others')">
        <button type="button" @click="$emit('open', around.prev.id)">
          <span>{{ t("prev") }}</span>
          <strong>‹ {{ around.prev.name }}</strong>
        </button>
        <button type="button" class="is-next" @click="$emit('open', around.next.id)">
          <span>{{ t("next") }}</span>
          <strong>{{ around.next.name }} ›</strong>
        </button>
      </nav>
    </article>
  </div>
</template>

<style scoped>
.dossier-page {
  position: relative;
  width: 100%;
  min-height: 100%;
}

.dossier-ground {
  position: fixed;
  z-index: 0;
  inset: 0;
  pointer-events: none;
}

.dossier-bar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.25rem 0.4rem;
}

.back {
  min-height: 2.5rem;
  padding: 0.2rem 0.8rem;
  border: 3px solid #163628;
  outline: 2px solid #8fd18a;
  outline-offset: -5px;
  background: #0b1c14;
  color: #d7f0c4;
  box-shadow: 0 3px 0 #06140c;
  font: inherit;
  font-size: 1rem;
  cursor: pointer;
}

.back:hover {
  color: #f4ffe8;
  border-color: #8fd18a;
}

.dossier {
  position: relative;
  z-index: 1;
  width: min(64rem, calc(100vw - 2rem));
  margin: 0.6rem auto 2.5rem;
  padding: clamp(1.1rem, 3vw, 2rem);
  background: #0b1c14;
  border: 4px solid #163628;
  outline: 2px solid #8fd18a;
  outline-offset: -6px;
  box-shadow: 0 6px 0 #06140c;
  color: #d7f0c4;
  animation: dossier-open 0.6s cubic-bezier(0.16, 0.7, 0.2, 1) both;
}

.dossier h1,
.dossier h2,
.dossier p {
  margin: 0;
}

.dossier-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    "kind status"
    "name name"
    "pitch pitch";
  align-items: center;
  gap: 0.35rem 1rem;
}

.kind {
  grid-area: kind;
  color: #8fd18a;
  font-size: 0.95rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.dossier-head h1 {
  grid-area: name;
  color: #f4ffe8;
  font-size: clamp(2.3rem, 6vw, 3.8rem);
  line-height: 1;
}

.dossier-head .pitch {
  grid-area: pitch;
  max-width: 52ch;
  margin-top: 0.3rem;
  font-size: 1.1rem;
  line-height: 1.4;
  text-wrap: pretty;
}

.status {
  grid-area: status;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.7rem;
  border: 2px solid #1d4a32;
  background: #10281c;
  font-size: 0.95rem;
  white-space: nowrap;
}

.led {
  width: 0.65rem;
  height: 0.65rem;
  background: var(--led, #8fd18a);
  box-shadow: 0 0 0 2px #06140c, 0 0 10px var(--led, #8fd18a);
}

.status.is-demo { --led: #8fd18a; }
.status.is-soon { --led: #f2d56b; }
.status.is-offline { --led: #c9b08a; }
.status.is-domain-lost { --led: #e2725b; }

.status.is-demo .led,
.status.is-soon .led {
  animation: led-pulse 1.6s steps(2, jump-none) infinite;
}

.status.is-offline .led,
.status.is-domain-lost .led {
  box-shadow: 0 0 0 2px #06140c;
}

.screen {
  margin-top: 1.4rem;
}

.frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background: #06140c;
  border: 3px solid #1d4a32;
  box-shadow: inset 0 0 0 2px #06140c;
  touch-action: pan-y;
  user-select: none;
}

.frame:focus-visible {
  outline: 3px solid #8fd18a;
  outline-offset: 3px;
}

.frame img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  -webkit-user-drag: none;
}

.shot-next-enter-active,
.shot-next-leave-active,
.shot-prev-enter-active,
.shot-prev-leave-active {
  transition:
    opacity 0.45s ease,
    transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.shot-next-enter-from { opacity: 0; transform: translateX(6%); }
.shot-next-leave-to { opacity: 0; transform: translateX(-6%); }
.shot-prev-enter-from { opacity: 0; transform: translateX(-6%); }
.shot-prev-leave-to { opacity: 0; transform: translateX(6%); }

.turn {
  position: absolute;
  z-index: 2;
  top: 50%;
  width: 2.75rem;
  height: 2.75rem;
  transform: translateY(-50%);
  border: 3px solid #163628;
  background: #0b1c14e6;
  color: #d7f0c4;
  font: inherit;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.turn.is-prev { left: 0.6rem; }
.turn.is-next { right: 0.6rem; }

.turn:hover,
.turn:focus-visible {
  opacity: 1;
  color: #f4ffe8;
  border-color: #8fd18a;
}

.counter {
  position: absolute;
  z-index: 2;
  right: 0.6rem;
  bottom: 0.6rem;
  padding: 0.15rem 0.5rem;
  background: #0b1c14e6;
  border: 2px solid #163628;
  font-size: 0.9rem;
}

.thumbs {
  display: flex;
  gap: 0.5rem;
  margin: 0.6rem 0 0;
  padding: 0;
  overflow-x: auto;
  list-style: none;
  scrollbar-width: thin;
}

.thumbs button {
  display: block;
  width: 7.5rem;
  padding: 0;
  border: 3px solid #1d4a32;
  background: #06140c;
  opacity: 0.55;
  cursor: pointer;
  transition: opacity 0.2s ease, border-color 0.2s ease;
}

.thumbs button:hover,
.thumbs button[aria-current="true"] {
  opacity: 1;
  border-color: #8fd18a;
}

.thumbs img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top;
}

.dossier-body {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(15rem, 1fr);
  gap: clamp(1.25rem, 3vw, 2.5rem);
  margin-top: 1.6rem;
}

.story p {
  max-width: 60ch;
  font-size: 1.1rem;
  line-height: 1.5;
  text-wrap: pretty;
}

.story .note {
  margin-top: 0.9rem;
  padding: 0.6rem 0.8rem;
  border-left: 4px solid #f2d56b;
  background: #10281c;
  font-size: 1rem;
}

.dossier h2 {
  margin-top: 1.4rem;
  color: #8fd18a;
  font-size: 1.05rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.built {
  display: grid;
  gap: 0.45rem;
  margin: 0.7rem 0 0;
  padding: 0;
  list-style: none;
}

.built li {
  position: relative;
  padding-left: 1.35rem;
  line-height: 1.4;
}

.built li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.45em;
  width: 0.55rem;
  height: 0.55rem;
  background: #8fd18a;
}

.facts {
  align-self: start;
  padding: 1rem;
  border: 2px solid #1d4a32;
  background: #10281c;
}

.facts dl {
  display: grid;
  gap: 0.6rem;
  margin: 0;
}

.facts dl div {
  display: grid;
  gap: 0.1rem;
}

.facts dt {
  color: #8fd18a;
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.facts dd {
  margin: 0;
  color: #f4ffe8;
  line-height: 1.3;
}

.facts h2 {
  margin-top: 1.1rem;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.6rem 0 0;
  padding: 0;
  list-style: none;
}

.chips li {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 2rem;
  padding: 0.2rem 0.55rem;
  border: 2px solid #2b6a45;
  background: #0b1c14;
  color: #d7f0c4;
  font-size: 0.95rem;
  animation: chip-in 0.4s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  animation-delay: calc(var(--i, 0) * 45ms + 250ms);
}

.chips img {
  width: 1.1rem;
  height: 1.1rem;
  object-fit: contain;
}

.demo {
  display: block;
  margin-top: 1.1rem;
  padding: 0.6rem 0.8rem;
  border: 2px solid #8fd18a;
  background: #1d6b32;
  color: #f4ffe8;
  text-align: center;
  text-decoration: none;
  font-size: 1.05rem;
}

.demo:hover {
  background: #23803c;
}

.sequel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  margin-top: 2rem;
  padding-top: 1.2rem;
  border-top: 2px solid #163628;
}

.sequel button {
  display: grid;
  gap: 0.2rem;
  justify-items: start;
  padding: 0.65rem 0.85rem;
  border: 2px solid #1d4a32;
  background: #10281c;
  color: #d7f0c4;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.sequel .is-next {
  justify-items: end;
  text-align: right;
}

.sequel span {
  color: #8fd18a;
  font-size: 0.85rem;
}

.sequel strong {
  font-size: 1.25rem;
}

.sequel button:hover {
  color: #f4ffe8;
  border-color: #8fd18a;
}

.back:focus-visible,
.turn:focus-visible,
.thumbs button:focus-visible,
.demo:focus-visible,
.sequel button:focus-visible {
  outline: 3px solid #8fd18a;
  outline-offset: 2px;
}

@media (max-width: 760px) {
  .dossier-head {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "kind"
      "name"
      "pitch"
      "status";
  }

  .status {
    justify-self: start;
    margin-top: 0.4rem;
  }

  .dossier-body {
    grid-template-columns: minmax(0, 1fr);
  }

  .frame {
    aspect-ratio: 16 / 10;
  }

  .turn {
    width: 2.4rem;
    height: 2.4rem;
  }

  .thumbs button {
    width: 5.5rem;
  }

  .sequel strong {
    font-size: 1.05rem;
  }
}

@keyframes dossier-open {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes chip-in {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes led-pulse {
  50% {
    opacity: 0.35;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dossier,
  .chips li,
  .status .led {
    animation: none !important;
  }

  .shot-next-enter-active,
  .shot-next-leave-active,
  .shot-prev-enter-active,
  .shot-prev-leave-active {
    transition: none;
  }
}
</style>
