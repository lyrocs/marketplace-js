<script setup lang="ts">
interface Props {
  title: string
  description: string
  backgroundImage: string
}

defineProps<Props>()
</script>

<template>
  <section class="relative h-72 overflow-hidden rounded-2xl bg-slate-800">
    <img
      :src="backgroundImage"
      alt="Banner"
      class="absolute inset-0 size-full object-cover opacity-40"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
    <div class="relative flex h-full flex-col items-center justify-center p-4 text-center">
      <h1 class="text-4xl font-extrabold text-white md:text-5xl">{{ title }}</h1>
      <p class="mt-2 max-w-2xl text-lg text-slate-200">{{ description }}</p>
      <div class="mt-8">
        <slot />
      </div>
    </div>
  </section>
</template>
