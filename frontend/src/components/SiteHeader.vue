<script setup>
import Intro from "./Intro.vue";

defineProps({
  title: { type: String, required: true },
  lead: { type: String, required: true },
});
</script>

<template>
  <header class="site-header">
    <nav v-if="$slots.menu" class="site-nav" aria-label="Menu">
      <slot name="menu" />
    </nav>
    <Intro :title="title" :lead="lead" />
  </header>
</template>

<style scoped>
.site-header {
  z-index: 1;
  pointer-events: none;
}

.site-nav {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  pointer-events: auto;
}

@media (max-width: 760px) {
  .site-header {
    pointer-events: auto;
    padding: 1.75rem 1.25rem 1.25rem;
  }
}
</style>
