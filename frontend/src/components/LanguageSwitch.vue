<script setup>
defineProps({
  locales: { type: Array, required: true },
  currentId: { type: String, required: true },
  label: { type: String, required: true },
  variant: { type: String, default: "stones" },
});

const emit = defineEmits(["choose"]);

function onChoose(id) {
  emit("choose", id);
}
</script>

<template>
  <nav class="languages" :class="variant" :aria-label="label">
    <button
      v-for="locale in locales"
      :key="locale.id"
      type="button"
      :class="`lang-${locale.id}`"
      :aria-pressed="locale.id === currentId"
      @click="onChoose(locale.id)"
    >
      {{ locale.label }}
    </button>
  </nav>
</template>

<style scoped>
.languages {
  display: contents;
}

.languages button {
  position: absolute;
  width: 8%;
  height: 14%;
  margin: 0;
  padding: 0;
  border: 0;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #0b3113;
  font-family: "Josefin Slab", serif;
  font-size: clamp(0.875rem, 1.6cqw, 1.75rem);
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
}

.lang-fr {
  left: var(--r-label-fr-x);
  top: var(--r-label-fr-y);
}

.lang-en {
  left: var(--r-label-en-x);
  top: var(--r-label-en-y);
}

.lang-pt-br {
  left: var(--r-label-pt-x);
  top: var(--r-label-pt-y);
}

.languages button:hover,
.languages button[aria-pressed="true"] {
  color: #1b481e;
}

.languages button:focus-visible {
  outline: 2px solid #8fd18a;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .languages.menu button {
    animation: none;
  }
}

.languages.bar {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: #0b1c14;
  border: 3px solid #163628;
  outline: 2px solid #8fd18a;
  outline-offset: -5px;
  box-shadow: 0 3px 0 #06140c;
}

.languages.bar button {
  position: static;
  width: auto;
  height: auto;
  min-width: 2.7rem;
  min-height: 2.2rem;
  transform: none;
  padding: 0.2rem 0.45rem;
  border: 2px solid #1d4a32;
  background: #10281c;
  color: #d7f0c4;
  font-size: 0.95rem;
}

.languages.bar button:hover,
.languages.bar button[aria-pressed="true"] {
  color: #f4ffe8;
  border-color: #8fd18a;
  background: #143528;
}

.languages.menu {
  display: grid;
  gap: 6px;
  margin-top: 1.15rem;
}

.languages.menu button {
  position: static;
  width: 100%;
  height: auto;
  min-height: 2.6rem;
  transform: none;
  padding: 0.35rem 0.6rem;
  border: 2px solid #1d4a32;
  background: #10281c;
  color: #d7f0c4;
  font-size: 1.15rem;
  animation: arrive 0.45s both;
}

.languages.menu button:nth-child(1) {
  animation-delay: 0.75s;
}

.languages.menu button:nth-child(2) {
  animation-delay: 0.9s;
}

.languages.menu button:nth-child(3) {
  animation-delay: 1.05s;
}

.languages.menu button:hover,
.languages.menu button[aria-pressed="true"] {
  color: #f4ffe8;
  border-color: #8fd18a;
  background: #143528;
}

@keyframes arrive {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.languages.inline {
  display: flex;
  gap: 0.35rem;
}

.languages.inline button {
  position: static;
  width: auto;
  height: auto;
  min-width: 2.75rem;
  min-height: 2.75rem;
  transform: none;
  padding: 0.2rem 0.45rem;
}
</style>
