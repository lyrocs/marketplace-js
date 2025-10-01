<script setup lang="ts">
interface Props {
  href: string
}

defineProps<Props>()
</script>

<template>
  <a :href="href" class="feature-card group">
    <div class="feature-card-icon">
      <slot name="icon" />
    </div>
    <h2 class="feature-card-title">
      <slot name="title" />
    </h2>
    <p class="feature-card-description">
      <slot name="description" />
    </p>
    <span class="feature-card-link">
      <slot name="link" />
    </span>
  </a>
</template>

<style scoped>
.feature-card {
  @apply block rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl;
}

.feature-card-icon {
  @apply mx-auto text-5xl text-slate-500 flex justify-center;
}

.feature-card-title {
  @apply mt-4 text-2xl font-bold text-gray-800;
}

.feature-card-description {
  @apply mt-1 text-gray-600;
}

.feature-card-link {
  @apply mt-4 inline-block font-semibold text-slate-600;
}
</style>
