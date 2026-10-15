<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { textFor } from "../copy.js";
import { createPathWorld } from "../pathWorld.js";
import { STOP_IDS, stops } from "../walk.js";

const props = defineProps({
  walk: { type: Object, required: true },
  localeId: { type: String, required: true },
});

const emit = defineEmits(["press", "release", "enter", "resume", "open", "dismiss"]);

const root = ref(null);
const view = ref(null);
const enterButton = ref(null);
const reduced = ref(false);
let world = null;
let frame = 0;
let alive = true;

const signLabel = computed(() =>
  props.walk.stopId ? textFor(props.localeId, props.walk.stopId) : "",
);

function labels() {
  return stops.map((stop) => textFor(props.localeId, stop.id));
}

function draw() {
  if (!alive || !world) return;
  world.sync(props.walk);
  world.render();
  frame = window.requestAnimationFrame(draw);
}

function hold(dir, event) {
  event.currentTarget.setPointerCapture?.(event.pointerId);
  emit("press", dir);
}

function letGo(dir) {
  emit("release", dir);
}

function trap(event) {
  if (props.walk.mode !== "sign" || event.key !== "Tab") return;
  const buttons = event.currentTarget.querySelectorAll("button");
  if (buttons.length < 2) return;
  const first = buttons[0];
  const last = buttons[buttons.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

watch(
  () => props.localeId,
  () => world?.setLabels(labels()),
);

function focusPath(event) {
  if (event?.target instanceof Element && event.target.closest("button")) return;
  root.value?.focus({ preventScroll: true });
}

watch(
  () => props.walk.mode,
  async (mode) => {
    await nextTick();
    if (mode === "sign") enterButton.value?.focus();
    else if (mode === "walk") focusPath();
  },
);

function onResize() {
  if (!root.value || !world) return;
  world.resize(root.value.clientWidth, root.value.clientHeight);
}

onMounted(() => {
  reduced.value = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  createPathWorld(view.value)
    .then((api) => {
      if (!alive) {
        api.dispose();
        return;
      }
      world = api;
      world.setLabels(labels());
      onResize();
      draw();
    })
    .catch(() => {});
  window.addEventListener("resize", onResize);
  focusPath();
});

onBeforeUnmount(() => {
  alive = false;
  window.cancelAnimationFrame(frame);
  window.removeEventListener("resize", onResize);
  world?.dispose();
  world = null;
});
</script>

<template>
  <div ref="root" class="path" tabindex="-1" @pointerdown="focusPath">
    <canvas ref="view" aria-hidden="true"></canvas>

    <div class="drift" aria-hidden="true">
      <i class="flake"></i>
      <i class="flake is-late"></i>
      <i class="flake is-slow"></i>
    </div>

    <div v-if="walk.hint && walk.mode === 'walk'" class="hint panel">
      <p>{{ textFor(localeId, "hint") }}</p>
      <button type="button" @click="emit('dismiss')">
        {{ textFor(localeId, "hintClose") }}
      </button>
    </div>

    <div
      v-if="walk.mode === 'sign'"
      class="sign-card panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-title"
      @keydown="trap"
    >
      <h2 id="sign-title">{{ signLabel }}</h2>
      <div class="sign-actions">
        <button ref="enterButton" type="button" @click="emit('enter')">
          {{ textFor(localeId, "enter") }}
        </button>
        <button type="button" @click="emit('resume')">
          {{ textFor(localeId, "continue") }}
        </button>
      </div>
    </div>

    <div v-if="reduced" class="stops panel">
      <button
        v-for="id in STOP_IDS"
        :key="id"
        type="button"
        @click="emit('open', id)"
      >
        {{ textFor(localeId, id) }}
      </button>
    </div>

    <div v-else-if="walk.mode === 'walk'" class="pad">
      <button
        type="button"
        :aria-label="textFor(localeId, 'walkLeft')"
        @pointerdown="hold(-1, $event)"
        @pointerup="letGo(-1)"
        @pointercancel="letGo(-1)"
      >
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M8 1 L3 6 L8 11" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
      </button>
      <button
        type="button"
        :aria-label="textFor(localeId, 'walkRight')"
        @pointerdown="hold(1, $event)"
        @pointerup="letGo(1)"
        @pointercancel="letGo(1)"
      >
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M4 1 L9 6 L4 11" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
      </button>
    </div>
  </div>
</template>
