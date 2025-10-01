<script setup lang="ts">
interface Props {
  title: string
  description: string
  backgroundImage: string
}

defineProps<Props>()
</script>

<template>
  <section class="banner">
    <img :src="backgroundImage" alt="Banner" class="banner-image" />
    <div class="banner-overlay" />
    <div class="banner-content">
      <h1 class="banner-title">{{ title }}</h1>
      <p class="banner-description">{{ description }}</p>
      <div class="banner-actions">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.banner {
  @apply relative h-72 overflow-hidden rounded-2xl bg-slate-800;
}

.banner-image {
  @apply absolute inset-0 size-full object-cover opacity-40;
}

.banner-overlay {
  @apply absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent;
}

.banner-content {
  @apply relative flex h-full flex-col items-center justify-center p-4 text-center;
}

.banner-title {
  @apply text-4xl font-extrabold text-white md:text-5xl;
}

.banner-description {
  @apply mt-2 max-w-2xl text-lg text-slate-200;
}

.banner-actions {
  @apply mt-8;
}
</style>
