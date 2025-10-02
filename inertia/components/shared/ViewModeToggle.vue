<script setup lang="ts">
interface Props {
  modelValue: 'grid' | 'list'
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: 'grid' | 'list']
}>()
</script>

<template>
  <div class="view-toggle">
    <button
      :class="['view-toggle-button', modelValue === 'grid' ? 'view-toggle-active' : 'view-toggle-inactive']"
      @click="emit('update:modelValue', 'grid')"
      title="Vue grille"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    </button>
    <button
      :class="['view-toggle-button', modelValue === 'list' ? 'view-toggle-active' : 'view-toggle-inactive']"
      @click="emit('update:modelValue', 'list')"
      title="Vue liste"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.view-toggle {
  @apply flex items-center border border-gray-200 rounded-lg p-1;
}

.view-toggle-button {
  @apply p-2 rounded-md transition-colors;
}

.view-toggle-active {
  @apply bg-gray-100 text-gray-900;
}

.view-toggle-inactive {
  @apply text-gray-500 hover:text-gray-700;
}
</style>
