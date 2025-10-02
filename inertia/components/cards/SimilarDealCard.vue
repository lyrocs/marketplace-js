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
  <a :href="`/deals/${deal.id}`" class="similar-deal-card">
    <div class="similar-deal-image-container">
      <img
        v-if="deal.images?.[0]"
        :src="deal.images[0]"
        :alt="deal.title"
        class="similar-deal-image"
      />
      <div v-else class="similar-deal-no-image">
        <span class="text-gray-400">Pas d'image</span>
      </div>
    </div>
    <div class="similar-deal-content">
      <h4 class="similar-deal-title">{{ deal.title }}</h4>
      <p class="similar-deal-price">{{ deal.price }} {{ deal.currency }}</p>
      <p v-if="deal.location" class="similar-deal-location">{{ deal.location }}</p>
    </div>
  </a>
</template>

<style scoped>
.similar-deal-card {
  @apply block bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden;
}

.similar-deal-image-container {
  @apply w-full h-48 overflow-hidden;
}

.similar-deal-image {
  @apply w-full h-full object-cover;
}

.similar-deal-no-image {
  @apply w-full h-full bg-gray-100 flex items-center justify-center;
}

.similar-deal-content {
  @apply p-4;
}

.similar-deal-title {
  @apply font-semibold text-gray-900 line-clamp-2 mb-2;
}

.similar-deal-price {
  @apply text-lg font-bold text-slate-700 mb-1;
}

.similar-deal-location {
  @apply text-sm text-gray-500;
}
</style>
