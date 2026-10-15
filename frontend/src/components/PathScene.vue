<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import grove from "../../../assets/plates/grove.png";
import panda from "../../../assets/plates/panda.png";
import { textFor } from "../copy.js";
import { STOP_IDS, WORLD, stops } from "../walk.js";

const props = defineProps({
  walk: { type: Object, required: true },
  localeId: { type: String, required: true },
});

const emit = defineEmits(["press", "release", "enter", "resume", "open", "dismiss"]);

const root = ref(null);
const world = ref(null);
const enterButton = ref(null);
const camera = ref(0);
const reduced = ref(false);

const signLabel = computed(() =>
  props.walk.stopId ? textFor(props.localeId, props.walk.stopId) : "",
);

const frame = computed(() => (Math.floor(props.walk.x / 12) % 2 === 0 ? "0%" : "100%"));

function place(x) {
  return `${(x / WORLD.width) * 100}%`;
}

function updateCamera() {
  const view = root.value?.clientWidth ?? 0;
  const width = world.value?.clientWidth ?? view;
  const scale = width / WORLD.width;
  const focus = props.walk.x * scale - view * 0.38;
  camera.value = Math.min(Math.max(focus, 0), Math.max(0, width - view));
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

watch(() => props.walk.x, updateCamera);

watch(
  () => props.walk.mode,
  async (mode) => {
    if (mode !== "sign") return;
    await nextTick();
    enterButton.value?.focus();
  },
);

onMounted(() => {
  reduced.value = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  updateCamera();
  window.addEventListener("resize", updateCamera);
});

onBeforeUnmount(() => window.removeEventListener("resize", updateCamera));
</script>

<template>
  <div ref="root" class="path">
    <div
      ref="world"
      class="world"
      :style="{ transform: `translate3d(${-camera}px, 0, 0)` }"
    >
      <img class="plate" :src="grove" alt="" />
      <div
        v-for="stop in stops"
        :key="stop.id"
        class="sign"
        :style="{ left: place(stop.x) }"
      >
        <p class="board">{{ textFor(localeId, stop.id) }}</p>
        <i class="post"></i>
      </div>
      <div
        class="panda"
        :style="{
          left: place(walk.x),
          backgroundImage: `url(${panda})`,
          backgroundPosition: `${frame} 0`,
          transform: `translateX(-50%) scaleX(${walk.facing})`,
        }"
      ></div>
    </div>

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
