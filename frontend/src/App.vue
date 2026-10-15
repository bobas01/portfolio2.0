<script setup>
import { computed, ref } from "vue";
import GroveScene from "./components/GroveScene.vue";
import Intro from "./components/Intro.vue";
import LanguageSwitch from "./components/LanguageSwitch.vue";
import Workbench from "./components/Workbench.vue";
import { contact, cvByLocale, textFor } from "./copy.js";
import { sectionIds } from "./menu.js";
import { useLocale } from "./useLocale.js";

const { locales, localeId, title, lead, languagesLabel, chooseLocale } = useLocale();
const view = ref("grove");

const menuItems = computed(() =>
  sectionIds.map((id) => ({ id, label: textFor(localeId.value, id) })),
);

function openSection(id) {
  view.value = id === "travaux" ? "bench" : id;
}
</script>

<template>
  <main class="clairiere" :class="{ 'is-bench': view === 'bench' }">
    <div v-if="view === 'grove'" class="stage">
      <GroveScene>
        <div class="top-bar">
          <LanguageSwitch
            variant="bar"
            :locales="locales"
            :current-id="localeId"
            :label="languagesLabel"
            @choose="chooseLocale"
          />
        </div>
        <div class="arrival">
          <div class="panel">
            <Intro :title="title" :lead="lead" />
            <nav class="lines" :aria-label="textFor(localeId, 'portfolio')">
              <button
                v-for="item in menuItems"
                :key="item.id"
                type="button"
                @click="openSection(item.id)"
              >
                {{ item.label }}
              </button>
            </nav>
          </div>
        </div>
      </GroveScene>
    </div>

    <Workbench v-else-if="view === 'bench'" :locale-id="localeId" @grove="view = 'grove'">
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
          <button type="button" class="back-link" @click="view = 'grove'">
            {{ textFor(localeId, "grove") }}
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
