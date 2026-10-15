<script setup>
defineProps({
  items: { type: Array, required: true },
  label: { type: String, required: true },
});

const emit = defineEmits(["open"]);

function onOpen(id) {
  emit("open", id);
}
</script>

<template>
  <nav v-if="items.length > 0" class="site-menu" :aria-label="label">
    <button v-for="item in items" :key="item.id" type="button" @click="onOpen(item.id)">
      {{ item.label }}
    </button>
  </nav>
</template>

<style scoped>
.site-menu {
  position: absolute;
  z-index: 2;
  top: 0.75rem;
  left: 50%;
  display: flex;
  gap: 1.25rem;
  transform: translateX(-50%);
}

.site-menu button {
  margin: 0;
  padding: 0.35rem 0.8rem;
  border: 2px solid #1d4a32;
  background: #0b1c14;
  color: #d7f0c4;
  font-family: "Josefin Slab", serif;
  font-size: clamp(0.95rem, 1.4cqw, 1.25rem);
  font-weight: 700;
  cursor: pointer;
}

.site-menu button:hover {
  color: #f4ffe8;
  border-color: #8fd18a;
}

.site-menu button:focus-visible {
  outline: 2px solid #0a371a;
  outline-offset: 3px;
}
</style>
