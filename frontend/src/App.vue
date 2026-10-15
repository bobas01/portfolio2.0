<script setup>
import { ref, watch } from "vue";
import GroveScene from "./components/GroveScene.vue";
import LanguageSwitch from "./components/LanguageSwitch.vue";
import PathScene from "./components/PathScene.vue";
import Workbench from "./components/Workbench.vue";
import { contact, cvByLocale, letterHref, textFor } from "./copy.js";
import { useJourney } from "./useJourney.js";
import { useLocale } from "./useLocale.js";
import { isStopId, STOP_IDS } from "./walk.js";
import { skillCategories, skillsIn } from "./works.js";

const { locales, localeId, title, languagesLabel, chooseLocale } = useLocale();
const { walk, press, release, enter, resume, open, dismiss } = useJourney();
const view = ref("grove");
const jumpsOpen = ref(false);
const letter = ref({ name: "", email: "", message: "" });

const groupKey = { dev: "groupDev", tools: "groupTools", cloud: "groupCloud" };

watch(
  () => walk.value.mode,
  (mode, previous) => {
    if (previous === "page" && mode === "walk") view.value = "grove";
  },
);

function onEnter() {
  const id = enter();
  if (!isStopId(id)) return;
  view.value = id === "travaux" ? "bench" : id;
}

function onResume() {
  resume();
  view.value = "grove";
}

function onJump(id) {
  if (!isStopId(id)) return;
  open(id);
  view.value = "grove";
  jumpsOpen.value = false;
}

function onPageBackdrop(event) {
  if (event.target.closest(".panel, .top-bar, button, a, input, textarea")) return;
  onResume();
}

function sendLetter() {
  const href = letterHref(contact.email, letter.value);
  if (!href) return;
  window.location.href = href;
}
</script>

<template>
  <main class="clairiere" :class="{ 'is-bench': view === 'bench' }">
    <template v-if="view === 'grove'">
      <PathScene
        :walk="walk"
        :locale-id="localeId"
        @press="press"
        @release="release"
        @enter="onEnter"
        @resume="onResume"
        @open="open"
        @dismiss="dismiss"
      />
      <div class="top-bar">
        <p class="who-name">
          <img class="mark" src="/logo-panda.png" alt="" />
          {{ title }}
        </p>
        <LanguageSwitch
          variant="bar"
          :locales="locales"
          :current-id="localeId"
          :label="languagesLabel"
          @choose="chooseLocale"
        />
      </div>
    </template>

    <Workbench
      v-else-if="view === 'bench'"
      :locale-id="localeId"
      :back-label="textFor(localeId, 'resume')"
      @grove="onResume"
    >
      <template #languages>
        <LanguageSwitch
          variant="bar"
          :locales="locales"
          :current-id="localeId"
          :label="languagesLabel"
          @choose="chooseLocale"
        />
      </template>
    </Workbench>

    <div v-else class="stage" @pointerdown="onPageBackdrop">
      <GroveScene>
        <div class="top-bar">
          <button type="button" class="back-link" @click="onResume">
            {{ textFor(localeId, "resume") }}
          </button>
          <LanguageSwitch
            variant="bar"
            :locales="locales"
            :current-id="localeId"
            :label="languagesLabel"
            @choose="chooseLocale"
          />
        </div>
        <div class="arrival">
          <article class="panel page">
            <h1>{{ textFor(localeId, view) }}</h1>
            <div v-if="view === 'propos'" class="about">
              <div class="portrait">
                <img src="/portrait.png" alt="" />
              </div>
              <div>
                <p class="name">{{ title }}</p>
                <p>{{ textFor(localeId, "about") }}</p>
                <p>{{ textFor(localeId, "aboutNext") }}</p>
                <p>{{ textFor(localeId, "aboutNow") }}</p>
              </div>
            </div>
            <div v-else-if="view === 'skills'" class="kit">
              <p class="contact-line">{{ textFor(localeId, "skillsIntro") }}</p>
              <section v-for="category in skillCategories" :key="category">
                <h2>{{ textFor(localeId, groupKey[category]) }}</h2>
                <ul>
                  <li v-for="skill in skillsIn(category)" :key="skill.id">
                    <img :src="skill.logo" :alt="skill.name" />
                    <span>{{ skill.name }}</span>
                  </li>
                </ul>
              </section>
            </div>
            <template v-else>
              <p class="contact-line">{{ textFor(localeId, "contactIntro") }}</p>
              <form class="letter" @submit.prevent="sendLetter">
                <label>
                  {{ textFor(localeId, "formName") }}
                  <input v-model="letter.name" name="name" type="text" required maxlength="80" autocomplete="name" />
                </label>
                <label>
                  {{ textFor(localeId, "formEmail") }}
                  <input v-model="letter.email" name="email" type="email" required maxlength="120" autocomplete="email" />
                </label>
                <label>
                  {{ textFor(localeId, "formMessage") }}
                  <textarea v-model="letter.message" name="message" required maxlength="2000" rows="5"></textarea>
                </label>
                <button type="submit">{{ textFor(localeId, "formSend") }}</button>
                <p>{{ textFor(localeId, "formHint") }}</p>
              </form>
              <ul class="reach">
                <li>
                  <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
                </li>
                <li>
                  <a :href="contact.whatsapp" target="_blank" rel="noopener noreferrer">
                    WhatsApp · {{ contact.phone }}
                  </a>
                </li>
                <li>{{ contact.place }}</li>
                <li>
                  <a
                    :href="cvByLocale[localeId] ?? cvByLocale.fr"
                    :download="(cvByLocale[localeId] ?? cvByLocale.fr).split('/').pop()"
                  >
                    {{ textFor(localeId, "cv") }}
                  </a>
                </li>
              </ul>
            </template>
          </article>
        </div>
      </GroveScene>
    </div>

    <nav class="frise" :class="{ 'is-open': jumpsOpen }" :aria-label="textFor(localeId, 'jump')">
      <button type="button" class="frise-toggle" :aria-expanded="jumpsOpen" @click="jumpsOpen = !jumpsOpen">
        {{ textFor(localeId, "jump") }}
      </button>
      <div class="frise-list">
        <button v-for="id in STOP_IDS" :key="id" type="button" @click="onJump(id)">
          {{ textFor(localeId, id) }}
        </button>
      </div>
    </nav>
  </main>
</template>
