<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  logoHref?: string
}

withDefaults(defineProps<Props>(), {
  logoHref: '/',
})
</script>

<template>
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
      {{ title }}
    </h2>
    <p class="mt-1 text-center text-gray-600">{{ subtitle }}</p>
  </div>
</template>
