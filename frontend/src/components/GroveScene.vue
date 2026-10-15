<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import grove from "../../../assets/plates/grove.png";

const swayX = ref(0);
const swayY = ref(0);

function onSway(event) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  swayX.value = (event.clientX / window.innerWidth - 0.5) * 16;
  swayY.value = (event.clientY / window.innerHeight - 0.5) * 10;
}

onMounted(() => window.addEventListener("pointermove", onSway));
onBeforeUnmount(() => window.removeEventListener("pointermove", onSway));
</script>

<template>
  <div class="scene" :style="{ '--sx': `${swayX}px`, '--sy': `${swayY}px` }">
    <img class="grove" :src="grove" alt="" />
    <div class="drift" aria-hidden="true">
      <i class="flake"></i>
      <i class="flake is-late"></i>
      <i class="flake is-slow"></i>
    </div>
    <slot />
  </div>
</template>
