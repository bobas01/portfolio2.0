<script setup>
defineProps({
  title: { type: String, required: true },
  lead: { type: String, required: true },
  role: { type: String, default: "" },
});
</script>

<template>
  <header class="intro">
    <h1>{{ title }}</h1>
    <p v-if="role" class="role">{{ role }}</p>
    <p class="lead">{{ lead }}</p>
  </header>
</template>

<style scoped>
.intro {
  text-align: center;
  color: #d7f0c4;
}

h1,
.role,
.lead {
  margin: 0;
  font-family: "Josefin Slab", serif;
  font-weight: 700;
}

h1 {
  font-size: clamp(1.6rem, 7.4vw, 2.6rem);
  white-space: nowrap;
  line-height: 1;
  animation: arrive 0.55s 0.35s both;
}

.role {
  margin-top: 0.45rem;
  color: #8fd18a;
  font-size: clamp(0.85rem, 1.6vw, 0.98rem);
  line-height: 1.2;
  animation: arrive 0.55s 0.45s both;
}

.role {
  text-wrap: balance;
}

.lead {
  margin-top: 0.8rem;
  max-width: 34ch;
  margin-inline: auto;
  font-size: clamp(1rem, 2vw, 1.15rem);
  line-height: 1.35;
  text-wrap: balance;
  animation: arrive 0.55s 0.55s both;
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

@media (prefers-reduced-motion: reduce) {
  h1,
  .role,
  .lead {
    animation: none;
  }
}
</style>
