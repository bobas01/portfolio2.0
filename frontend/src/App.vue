<script setup>
import { ref } from "vue";
import GroveScene from "./components/GroveScene.vue";
import LanguageSwitch from "./components/LanguageSwitch.vue";
import PathScene from "./components/PathScene.vue";
import Workbench from "./components/Workbench.vue";
import { contact, cvByLocale, textFor } from "./copy.js";
import { useJourney } from "./useJourney.js";
import { useLocale } from "./useLocale.js";
import { isStopId } from "./walk.js";
import { benchSkills } from "./works.js";

const { locales, localeId, title, languagesLabel, chooseLocale } = useLocale();
const { walk, press, release, enter, resume, open, dismiss } = useJourney();
const view = ref("grove");

function onEnter() {
  const id = enter();
  if (!isStopId(id)) return;
  view.value = id === "travaux" ? "bench" : id;
}

function onResume() {
  resume();
  view.value = "grove";
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
        <p class="who-name">{{ title }}</p>
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

    <div v-else class="stage">
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
              <ul>
                <li v-for="skill in benchSkills" :key="skill.id">
                  <img :src="skill.logo" :alt="skill.name" />
                  <span>{{ skill.name }}</span>
                </li>
              </ul>
            </div>
            <template v-else>
              <p class="contact-line">{{ textFor(localeId, "contactIntro") }}</p>
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
  </main>
</template>
