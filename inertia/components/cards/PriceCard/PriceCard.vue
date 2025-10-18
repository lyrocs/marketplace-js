<script setup lang="ts">
import { IconChatBubbleOutline } from '@iconify-prerendered/vue-material-symbols'

interface Props {
  price: number
  currency?: string
  state?: string
  negotiable?: boolean
}

withDefaults(defineProps<Props>(), {
  currency: '€',
  negotiable: true,
  state: 'Bon état',
})

const emit = defineEmits<{
  contact: []
  makeOffer: []
}>()
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <div class="text-center">
      <p class="text-4xl font-bold text-gray-900">{{ price }} {{ currency }}</p>
      <span v-if="negotiable" class="text-sm text-gray-500 mt-1">(Prix négociable)</span>
    </div>
    <span
      v-if="state"
      class="mt-3 block text-center bg-slate-100 text-slate-800 text-sm font-semibold px-3 py-1 rounded-full w-fit mx-auto"
      >État : {{ state }}</span
    >
    <div class="mt-6 flex flex-col gap-3">
      <button
        @click="emit('contact')"
        class="w-full font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300 bg-slate-700 text-white hover:bg-slate-800 flex items-center justify-center gap-2"
      >
        <IconChatBubbleOutline class="text-xl" />
        Contacter
      </button>
      <button
        @click="emit('makeOffer')"
        class="w-full font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300 bg-white border-2 border-slate-700 text-slate-700 hover:bg-slate-100"
      >
        Faire une offre
      </button>
    </div>
  </div>
</template>
