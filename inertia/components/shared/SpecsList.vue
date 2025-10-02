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
  <div class="specs-card">
    <h3 class="specs-title">{{ title }}</h3>
    <div class="specs-grid">
      <div v-for="(spec, index) in specs" :key="index" class="spec-item">
        <dt class="spec-label">{{ spec.label }}</dt>
        <dd class="spec-value">{{ spec.value }}</dd>
      </div>
    </div>
  </div>
</template>

<style scoped>
.specs-card {
  @apply bg-white rounded-xl shadow-lg p-6;
}

.specs-title {
  @apply font-bold text-lg text-gray-800 mb-4;
}

.specs-grid {
  @apply text-sm text-gray-700 space-y-4;
}

.spec-item {
  @apply flex justify-between items-center;
}

.spec-label {
  @apply flex items-center gap-2 text-gray-600;
}

.spec-value {
  @apply font-semibold bg-slate-100 px-2.5 py-1 rounded-md;
}
</style>
