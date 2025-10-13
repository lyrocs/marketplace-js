<script setup lang="ts">
import { computed } from 'vue'
import DealDto from '#dtos/deal'

const props = defineProps<{
  deal: DealDto
}>()

const currencySymbol = computed(() => {
  return props.deal.currency === 'EUR' ? '€' : '$'
})

const firstProductImage = computed(() => {
  return (
    props.deal.products[0]?.images?.[0] || 'https://placehold.co/400x300/475569/white?text=Deal'
  )
})
</script>

<template>
  <div class="deal-card group">
    <img :src="firstProductImage" class="deal-card-image" :alt="`${deal.title} deal image`" />

    <div class="deal-card-content">
      <!-- Deal title and location -->
      <div class="deal-card-header">
        <h3 class="deal-card-title">
          {{ deal.title }}
        </h3>
        <span class="deal-card-location">
          {{ deal.location }}
        </span>
      </div>

      <p class="deal-card-description">{{ deal.description }}</p>

      <div class="deal-card-products">
        <h4 class="deal-card-products-title">{{ $t('deal.includes') }}:</h4>
        <ul class="deal-card-products-list">
          <li v-for="product in deal.products" :key="product.id" class="deal-card-product-item">
            <span class="deal-card-product-name">{{ product.quantity }}x {{ product.name }}</span>
          </li>
        </ul>
      </div>

      <div class="deal-card-pricing">
        <div class="deal-card-price-section">
          <span class="deal-card-price-label">{{ $t('deal.totalPrice') }}:</span>
          <p class="deal-card-price">{{ deal.price }} {{ currencySymbol }}</p>
        </div>
        <div class="deal-card-actions">
          <Button as-child>
            <a :href="`/deals/${deal.id}`"> {{ $t('deal.seeDetails') }} </a>
          </Button>
        </div>
      </div>

      <!-- Vendeur -->
      <div class="deal-card-seller">
        <div class="deal-card-seller-info">
          <img
            :src="
              deal.user?.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(deal.user?.name || 'User')}&background=6366f1&color=fff&size=32`
            "
            :alt="deal.user?.name || 'Vendeur'"
            class="deal-card-seller-avatar"
          />
          <span class="deal-card-seller-name">{{ deal.user?.name || 'Vendeur' }}</span>
        </div>
        <a :href="`/user/${deal.user_id}`" class="deal-card-seller-link" @click.stop>
          {{ $t('deal.seeProfile') }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.deal-card {
  @apply flex flex-col overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300;
}

.deal-card-image {
  @apply h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105;
}

.deal-card-content {
  @apply flex flex-col p-4 flex-1;
}

.deal-card-header {
  @apply flex justify-between items-start mb-2;
}

.deal-card-title {
  @apply text-lg font-bold text-gray-800 hover:text-slate-600 line-clamp-2;
}

.deal-card-location {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2 whitespace-nowrap;
}

.deal-card-description {
  @apply text-sm text-gray-600 mb-4 line-clamp-2;
}

.deal-card-products {
  @apply mt-auto;
}

.deal-card-products-title {
  @apply text-sm font-medium text-gray-700 mb-2;
}

.deal-card-products-list {
  @apply space-y-1;
}

.deal-card-product-item {
  @apply flex justify-between text-sm;
}

.deal-card-product-name {
  @apply text-gray-600;
}

.deal-card-pricing {
  @apply mt-4 pt-3 border-t border-gray-100 flex justify-between items-center;
}

.deal-card-price-section {
  @apply flex flex-col;
}

.deal-card-price-label {
  @apply text-xs text-gray-500;
}

.deal-card-price {
  @apply text-xl font-bold text-gray-900;
}

.deal-card-actions {
  @apply flex;
}

.deal-card-seller {
  @apply mt-3 pt-3 border-t border-gray-100 flex items-center justify-between;
}

.deal-card-seller-info {
  @apply flex items-center space-x-2;
}

.deal-card-seller-avatar {
  @apply w-6 h-6 rounded-full;
}

.deal-card-seller-name {
  @apply text-sm text-gray-600;
}

.deal-card-seller-link {
  @apply text-xs text-indigo-600 hover:text-indigo-800 font-medium;
}
</style>
