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
  <div
    class="inline-flex items-center rounded-lg border border-white/10 bg-slate-900/50 p-1 backdrop-blur-sm"
  >
    <div class="flex">
      <button
        @click="emit('clickLeft')"
        class="rounded-md px-5 py-2 text-sm font-semibold text-slate-100 shadow-lg"
        :class="
          isLeftActive
            ? 'bg-white text-slate-800 hover:bg-white'
            : 'bg-slate-900 text-white hover:bg-slate-800'
        "
      >
        {{ leftLabel }}
      </button>
      <button
        @click="emit('clickRight')"
        class="rounded-md px-5 py-2 text-sm font-semibold text-slate-100 shadow-lg"
        :class="
          !isLeftActive
            ? 'bg-white text-slate-800 hover:bg-white'
            : 'bg-slate-900 text-white hover:bg-slate-800'
        "
      >
        {{ rightLabel }}
      </button>
    </div>
  </div>
</template>
