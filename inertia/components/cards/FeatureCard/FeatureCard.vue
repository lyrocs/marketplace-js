<script setup lang="ts">
interface Props {
  href: string
}

defineProps<Props>()
</script>

<template>
  <a
    :href="href"
    class="block rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
  >
    <div class="mx-auto text-5xl text-slate-500 flex justify-center">
      <slot name="icon" />
    </div>
    <h2 class="mt-4 text-2xl font-bold text-gray-800">
      <slot name="title" />
    </h2>
    <p class="mt-1 text-gray-600">
      <slot name="description" />
    </p>
    <span class="mt-4 inline-block font-semibold text-slate-600">
      <slot name="link" />
    </span>
  </a>
</template>
