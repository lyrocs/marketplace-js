<script setup lang="ts">
interface Props {
  iconClass?: string
}

defineProps<Props>()
</script>

<template>
  <div>
    <div class="mx-auto text-5xl text-slate-500 flex justify-center">
      <slot />
    </div>
    <h3 class="mt-4 text-xl font-bold text-gray-800">
      <slot name="title" />
    </h3>
    <p class="mt-1 text-gray-600">
      <slot name="description" />
    </p>
  </div>
</template>
