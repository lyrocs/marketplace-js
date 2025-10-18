<script setup lang="ts">
interface Spec {
  label: string
  value: string
}

interface Props {
  specs: Spec[]
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Caractéristiques clés',
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h3 class="font-bold text-lg text-gray-800 mb-4">{{ title }}</h3>
    <div class="text-sm text-gray-700 space-y-4">
      <div v-for="(spec, index) in specs" :key="index" class="flex justify-between items-center">
        <dt class="flex items-center gap-2 text-gray-600">{{ spec.label }}</dt>
        <dd class="font-semibold bg-slate-100 px-2.5 py-1 rounded-md">{{ spec.value }}</dd>
      </div>
    </div>
  </div>
</template>
