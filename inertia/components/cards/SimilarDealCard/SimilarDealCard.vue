<script setup lang="ts">
interface Deal {
  id: number
  title: string
  price: number
  currency: string
  images?: string[]
  location?: string
}

interface Props {
  deal: Deal
}

defineProps<Props>()
</script>

<template>
  <a
    :href="`/deals/${deal.id}`"
    class="block bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
  >
    <div class="w-full h-48 overflow-hidden">
      <img
        v-if="deal.images?.[0]"
        :src="deal.images[0]"
        :alt="deal.title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
        <span class="text-gray-400">Pas d'image</span>
      </div>
    </div>
    <div class="p-4">
      <h4 class="font-semibold text-gray-900 line-clamp-2 mb-2">{{ deal.title }}</h4>
      <p class="text-lg font-bold text-slate-700 mb-1">{{ deal.price }} {{ deal.currency }}</p>
      <p v-if="deal.location" class="text-sm text-gray-500">{{ deal.location }}</p>
    </div>
  </a>
</template>
