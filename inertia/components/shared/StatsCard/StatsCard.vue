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
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-600">{{ label }}</p>
        <p class="text-2xl font-bold" :class="valueColor">{{ value }}</p>
      </div>
      <div
        class="w-8 h-8 rounded-lg flex items-center justify-center"
        :class="iconColorClasses[iconColor]"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
