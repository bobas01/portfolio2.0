<script setup>
defineProps({
  title: { type: String, required: true },
  lead: { type: String, required: true },
});
</script>

<template>
  <header class="intro">
    <h1>{{ title }}</h1>
    <p class="lead">{{ lead }}</p>
  </header>
</template>

<style scoped>
.intro {
  text-align: center;
  color: #d7f0c4;
}

h1,
.lead {
  margin: 0;
  font-family: "Josefin Slab", serif;
  font-weight: 700;
}

h1 {
  font-size: clamp(1.8rem, 4.2vw, 2.8rem);
  line-height: 1.05;
  animation: arrive 0.55s 0.35s both;
}

.lead {
  margin-top: 0.7rem;
  max-width: 34ch;
  margin-inline: auto;
  font-size: clamp(1rem, 2vw, 1.15rem);
  line-height: 1.35;
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
  .lead {
    animation: none;
  }
}
</style>
