<script setup lang="ts">
interface Props {
  breadcrumb: string
  title: string
}

defineProps<Props>()
</script>

<template>
  <div>
    <span class="text-sm font-medium text-slate-600">{{ breadcrumb }}</span>
    <h1 class="mt-1 text-4xl font-bold text-gray-800 md:text-5xl">{{ title }}</h1>
  </div>
</template>
