<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import GroveScene from "./components/GroveScene.vue";
import Intro from "./components/Intro.vue";
import LanguageSwitch from "./components/LanguageSwitch.vue";
import ProjectPage from "./components/ProjectPage.vue";
import Workbench from "./components/Workbench.vue";
import { contact, cvByLocale, letterHref, textFor } from "./copy.js";
import { sectionIds } from "./menu.js";
import { useLocale } from "./useLocale.js";
import { findProject, projectIdFromPath, projectPath, projects, skillCategories, skillsIn } from "./works.js";

const { locales, localeId, title, lead, languagesLabel, chooseLocale } = useLocale();
const view = ref("grove");
const projectId = ref("");
const letter = ref({ name: "", email: "", message: "" });
const shell = ref(null);

const project = computed(() => findProject(projectId.value));
const benchStart = computed(() => Math.max(0, projects.findIndex((item) => item.id === projectId.value)));
const scrolls = computed(() => view.value === "bench" || view.value === "project");

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

function showProject(id) {
  projectId.value = id;
  view.value = "project";
  document.title = `${findProject(id).name} · ${title.value}`;
  shell.value?.scrollTo?.(0, 0);
}

function openProjectPage(id) {
  if (!findProject(id)) return;
  if (view.value === "project") {
    history.replaceState({ view: "project", fromApp: history.state?.fromApp === true }, "", projectPath(id));
  } else {
    history.replaceState({ view: view.value }, "");
    history.pushState({ view: "project", fromApp: true }, "", projectPath(id));
  }
  showProject(id);
}

function restoreTitle() {
  document.title = title.value;
}

function leaveProject() {
  if (history.state?.fromApp === true) {
    history.back();
    return;
  }
  history.replaceState({ view: "bench" }, "", "/");
  view.value = "bench";
  restoreTitle();
}

function onPopState() {
  const id = projectIdFromPath(window.location.pathname);
  if (id) {
    showProject(id);
    return;
  }
  const previous = history.state?.view;
  view.value = previous === "bench" || sectionIds.includes(previous) ? previous : "grove";
  restoreTitle();
}

function onKey(event) {
  if (event.key !== "Escape" || view.value === "grove") return;
  if (event.target.closest?.(".languages")) return;
  if (view.value === "project") leaveProject();
  else backToGrove();
}

function sendLetter() {
  const href = letterHref(contact.email, letter.value);
  if (!href) return;
  window.location.href = href;
}

onMounted(() => {
  window.addEventListener("keydown", onKey);
  window.addEventListener("popstate", onPopState);
  const id = projectIdFromPath(window.location.pathname);
  if (id) showProject(id);
  else if (window.location.pathname !== "/") history.replaceState(null, "", "/");
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  window.removeEventListener("popstate", onPopState);
});

watch(localeId, () => {
  if (view.value === "project" && project.value) document.title = `${project.value.name} · ${title.value}`;
});
</script>

<template>
  <main ref="shell" class="clairiere" :class="{ 'is-bench': scrolls }">
    <div v-if="view === 'grove'" class="stage">
      <GroveScene>
        <div class="top-bar">
          <span class="mark-frame">
            <img class="mark" src="/logo-panda.png" alt="" />
            <svg class="bamboo" viewBox="0 0 100 118" preserveAspectRatio="none" aria-hidden="true">
              <rect x="0" y="0" width="8" height="118" fill="#6fae4a" />
              <rect x="2" y="0" width="2" height="118" fill="#a6d672" />
              <rect x="92" y="0" width="8" height="118" fill="#6fae4a" />
              <rect x="94" y="0" width="2" height="118" fill="#a6d672" />
              <rect x="0" y="0" width="100" height="8" fill="#5f9f3e" />
              <rect x="0" y="2" width="100" height="2" fill="#98cc66" />
              <rect x="0" y="110" width="100" height="8" fill="#5f9f3e" />
              <rect x="0" y="112" width="100" height="2" fill="#98cc66" />
              <g fill="#2f6b2a">
                <rect x="0" y="34" width="8" height="3" />
                <rect x="0" y="72" width="8" height="3" />
                <rect x="92" y="46" width="8" height="3" />
                <rect x="92" y="84" width="8" height="3" />
                <rect x="36" y="0" width="3" height="8" />
                <rect x="70" y="0" width="3" height="8" />
                <rect x="28" y="110" width="3" height="8" />
                <rect x="62" y="110" width="3" height="8" />
              </g>
              <g fill="#7a4f26">
                <rect x="0" y="0" width="9" height="9" />
                <rect x="91" y="0" width="9" height="9" />
                <rect x="0" y="109" width="9" height="9" />
                <rect x="91" y="109" width="9" height="9" />
              </g>
              <path d="M96 4 L118 -8 L108 9 Z" fill="#3f8f52" />
              <path d="M98 10 L120 8 L104 17 Z" fill="#57a364" />
              <path d="M4 114 L-18 126 L-8 109 Z" fill="#3f8f52" />
              <path d="M2 108 L-20 110 L-4 101 Z" fill="#57a364" />
            </svg>
          </span>
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
            <Intro :title="title" :lead="lead" :role="textFor(localeId, 'role')" />
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

    <Workbench
      v-else-if="view === 'bench'"
      :locale-id="localeId"
      :start="benchStart"
      @grove="backToGrove"
      @open="openProjectPage"
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

    <ProjectPage
      v-else-if="view === 'project' && project"
      :project="project"
      :locale-id="localeId"
      @back="leaveProject"
      @open="openProjectPage"
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
    </ProjectPage>

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
