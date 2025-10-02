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
})

const emit = defineEmits<{
  contact: []
  makeOffer: []
}>()
</script>

<template>
  <div class="price-card">
    <div class="price-container">
      <p class="price-value">{{ price }} {{ currency }}</p>
      <span v-if="negotiable" class="price-negotiable">(Prix négociable)</span>
    </div>
    <span v-if="state" class="price-state">État : {{ state }}</span>
    <div class="price-actions">
      <button @click="emit('contact')" class="price-button price-button-primary">
        <IconChatBubbleOutline class="text-xl" />
        Contacter
      </button>
      <button @click="emit('makeOffer')" class="price-button price-button-secondary">
        Faire une offre
      </button>
    </div>
  </div>
</template>

<style scoped>
.price-card {
  @apply bg-white rounded-xl shadow-lg p-6;
}

.price-container {
  @apply text-center;
}

.price-value {
  @apply text-4xl font-bold text-gray-900;
}

.price-negotiable {
  @apply text-sm text-gray-500 mt-1;
}

.price-state {
  @apply mt-3 block text-center bg-slate-100 text-slate-800 text-sm font-semibold px-3 py-1 rounded-full w-fit mx-auto;
}

.price-actions {
  @apply mt-6 flex flex-col gap-3;
}

.price-button {
  @apply w-full font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300;
}

.price-button-primary {
  @apply bg-slate-700 text-white hover:bg-slate-800 flex items-center justify-center gap-2;
}

.price-button-secondary {
  @apply bg-white border-2 border-slate-700 text-slate-700 hover:bg-slate-100;
}
</style>
