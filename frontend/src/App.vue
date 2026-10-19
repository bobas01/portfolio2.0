<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import GroveScene from "./components/GroveScene.vue";
import Intro from "./components/Intro.vue";
import LanguageSwitch from "./components/LanguageSwitch.vue";
import Workbench from "./components/Workbench.vue";
import { contact, cvByLocale, letterHref, textFor } from "./copy.js";
import { sectionIds } from "./menu.js";
import { useLocale } from "./useLocale.js";
import { skillCategories, skillsIn } from "./works.js";

const { locales, localeId, title, lead, languagesLabel, chooseLocale } = useLocale();
const view = ref("grove");
const letter = ref({ name: "", email: "", message: "" });

const groupKey = { dev: "groupDev", tools: "groupTools", cloud: "groupCloud" };

const menuItems = computed(() =>
  sectionIds.map((id) => ({ id, label: textFor(localeId.value, id) })),
);

function openSection(id) {
  if (!sectionIds.includes(id)) return;
  view.value = id === "travaux" ? "bench" : id;
}

function backToGrove() {
  view.value = "grove";
}

function onPageBackdrop(event) {
  if (event.target.closest(".panel, .top-bar, button, a, input, textarea")) return;
  backToGrove();
}

function onKey(event) {
  if (event.key !== "Escape" || view.value === "grove") return;
  if (event.target.closest?.(".languages")) return;
  backToGrove();
}

function sendLetter() {
  const href = letterHref(contact.email, letter.value);
  if (!href) return;
  window.location.href = href;
}

onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
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
            <img class="mark" src="/logo-panda.png" alt="" />
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

    <Workbench v-else-if="view === 'bench'" :locale-id="localeId" @grove="backToGrove">
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
          <button type="button" class="back-link" @click="backToGrove">
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
  </main>
</template>
