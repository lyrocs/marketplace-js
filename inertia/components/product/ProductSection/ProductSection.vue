<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<template>
  <div class="rounded-xl bg-white p-6 shadow-lg md:p-8">
    <h2 class="text-2xl font-bold text-gray-800">{{ title }}</h2>
    <slot />
  </div>
</template>
