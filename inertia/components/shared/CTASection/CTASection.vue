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
  <section class="mt-20">
    <div class="rounded-xl bg-slate-700 p-12 text-center">
      <h2 class="text-3xl font-bold text-white">{{ title }}</h2>
      <p class="mx-auto mt-2 max-w-xl text-slate-200">{{ description }}</p>
      <a
        :href="buttonHref"
        class="mt-6 inline-block rounded-lg bg-white px-8 py-3 text-lg font-bold text-slate-800 transition-colors hover:bg-slate-200"
      >
        {{ buttonText }}
      </a>
    </div>
  </section>
</template>
