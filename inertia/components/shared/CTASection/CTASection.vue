<script setup lang="ts">
interface Props {
  title: string
  description: string
  buttonText: string
  buttonHref: string
}

defineProps<Props>()
</script>

<template>
  <section class="cta-wrapper">
    <div class="cta-container">
      <h2 class="cta-title">{{ title }}</h2>
      <p class="cta-description">{{ description }}</p>
      <a :href="buttonHref" class="cta-button">
        {{ buttonText }}
      </a>
    </div>
  </section>
</template>

<style scoped>
.cta-wrapper {
  @apply mt-20;
}

.cta-container {
  @apply rounded-xl bg-slate-700 p-12 text-center;
}

.cta-title {
  @apply text-3xl font-bold text-white;
}

.cta-description {
  @apply mx-auto mt-2 max-w-xl text-slate-200;
}

.cta-button {
  @apply mt-6 inline-block rounded-lg bg-white px-8 py-3 text-lg font-bold text-slate-800 transition-colors hover:bg-slate-200;
}
</style>
