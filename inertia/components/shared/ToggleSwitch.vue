<script setup lang="ts">
interface Props {
  leftLabel: string
  rightLabel: string
  isLeftActive: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  clickLeft: []
  clickRight: []
}>()
</script>

<template>
  <div class="toggle-wrapper">
    <div class="toggle-container">
      <button @click="emit('clickLeft')" class="toggle-button" :class="isLeftActive ? 'toggle-button-active' : 'toggle-button-inactive'">
        {{ leftLabel }}
      </button>
      <button @click="emit('clickRight')" class="toggle-button" :class="!isLeftActive ? 'toggle-button-active' : 'toggle-button-inactive'">
        {{ rightLabel }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.toggle-wrapper {
  @apply inline-flex items-center rounded-lg border border-white/10 bg-slate-900/50 p-1 backdrop-blur-sm;
}

.toggle-container {
  @apply flex;
}

.toggle-button {
  @apply rounded-md px-5 py-2 text-sm font-semibold text-slate-100 shadow-lg;
}

.toggle-button-active {
  @apply bg-white text-slate-800 hover:bg-white;
}

.toggle-button-inactive {
  @apply bg-slate-900 text-white hover:bg-slate-800;
}
</style>
