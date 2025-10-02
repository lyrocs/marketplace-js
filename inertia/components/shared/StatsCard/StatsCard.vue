<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  iconColor?: 'blue' | 'green' | 'yellow' | 'gray'
  valueColor?: string
}

withDefaults(defineProps<Props>(), {
  iconColor: 'blue',
  valueColor: 'text-gray-900',
})

const iconColorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  gray: 'bg-gray-100 text-gray-600',
}
</script>

<template>
  <div class="stats-card">
    <div class="stats-card-content">
      <div>
        <p class="stats-card-label">{{ label }}</p>
        <p class="stats-card-value" :class="valueColor">{{ value }}</p>
      </div>
      <div class="stats-card-icon" :class="iconColorClasses[iconColor]">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-4;
}

.stats-card-content {
  @apply flex items-center justify-between;
}

.stats-card-label {
  @apply text-sm font-medium text-gray-600;
}

.stats-card-value {
  @apply text-2xl font-bold;
}

.stats-card-icon {
  @apply w-8 h-8 rounded-lg flex items-center justify-center;
}
</style>
