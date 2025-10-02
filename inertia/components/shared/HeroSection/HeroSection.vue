<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'
import { IconSearch } from '@iconify-prerendered/vue-material-symbols'

interface Props {
  title: string
  description: string
  backgroundImage: string
  searchPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: 'Que recherchez-vous ?',
})

const searchInput = ref('')

const search = () => {
  if (searchInput.value.trim()) {
    router.get(`/products/search/${searchInput.value}`)
  }
}
</script>

<template>
  <section class="hero-section">
    <div class="hero-background" :style="{ backgroundImage: `url('${backgroundImage}')` }" />
    <div class="hero-overlay" />
    <div class="hero-content">
      <h1 class="hero-title">{{ title }}</h1>
      <p class="hero-description">{{ description }}</p>
      <div class="hero-search-wrapper">
        <div class="hero-search-container">
          <Input
            v-model="searchInput"
            @keyup.enter="search"
            type="text"
            :placeholder="searchPlaceholder"
            class="pl-10 text-black"
          />
          <span class="hero-search-icon">
            <IconSearch class="size-6 text-muted-foreground" />
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  @apply relative flex h-[60vh] min-h-[400px] items-center;
}

.hero-background {
  @apply absolute inset-0 size-full bg-cover bg-center;
}

.hero-overlay {
  @apply absolute inset-0 size-full bg-slate-900/60;
}

.hero-content {
  @apply container relative mx-auto px-4 text-center text-white;
}

.hero-title {
  @apply text-4xl font-extrabold tracking-tight md:text-6xl;
}

.hero-description {
  @apply mx-auto mt-4 max-w-3xl text-lg text-slate-200 md:text-xl;
}

.hero-search-wrapper {
  @apply mx-auto mt-8 flex max-w-xl items-center justify-center;
}

.hero-search-container {
  @apply relative w-full max-w-sm;
}

.hero-search-icon {
  @apply absolute inset-y-0 start-0 flex items-center justify-center px-2;
}
</style>
