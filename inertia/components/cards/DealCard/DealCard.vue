<script setup lang="ts">
import { computed } from 'vue'
import DealDto from '#dtos/deal'
import { IconLocationOnOutline, IconCalendarMonth } from '@iconify-prerendered/vue-material-symbols'

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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const totalProducts = computed(() => {
  return props.deal.products?.reduce((total, product) => total + (product.quantity || 1), 0) || 0
})
</script>

<template>
  <Card class="deal-card group">
    <!-- Image Header with overlays -->
    <div class="deal-card-image-container">
      <img :src="firstProductImage" class="deal-card-image" :alt="`${deal.title} deal image`" />

      <!-- Price Overlay -->
      <div class="deal-card-price-overlay">
        <div class="deal-card-price-container">
          <div class="deal-card-price-label">{{ $t('deal.totalPrice') }}</div>
          <div class="deal-card-price">{{ deal.price }} {{ currencySymbol }}</div>
        </div>
      </div>
    </div>

    <!-- Card Header -->
    <CardHeader class="deal-card-header">
      <div class="deal-card-header-content">
        <h3 class="deal-card-title">{{ deal.title }}</h3>

        <div class="deal-card-meta">
          <div class="deal-card-location-info">
            <IconLocationOnOutline class="deal-card-icon" />
            <span>{{ deal.location || $t('deal.noLocation') }}</span>
          </div>

          <span class="deal-card-separator">•</span>

          <div class="deal-card-date-info">
            <IconCalendarMonth class="deal-card-icon" />
            <span>{{ formatDate(deal.createdAt) }}</span>
          </div>
        </div>
      </div>
    </CardHeader>

    <!-- Card Content -->
    <CardContent class="deal-card-content">
      <p class="deal-card-description">{{ deal.description || $t('deal.noDescription') }}</p>

      <!-- Products Summary -->
      <div class="deal-card-products">
        <div class="deal-card-products-header">
          <span class="deal-card-products-title">{{ $t('deal.includes') }}</span>
          <Badge variant="outline" class="deal-card-products-count">
            {{ $t('deal.numberArticle', { count: totalProducts }) }}
          </Badge>
        </div>

        <div class="deal-card-products-list">
          <div
            v-for="product in deal.products?.slice(0, 2)"
            :key="product.id"
            class="deal-card-product-item"
          >
            <span class="deal-card-product-name">{{ product.quantity }}x {{ product.name }}</span>
          </div>

          <div v-if="deal.products && deal.products.length > 2" class="deal-card-products-more">
            {{ $t('deal.moreProduct', { count: deal.products.length - 2 }) }}
          </div>
        </div>
      </div>
    </CardContent>

    <!-- Card Footer -->
    <CardFooter class="deal-card-footer">
      <div class="deal-card-footer-content">
        <!-- Seller Info -->
        <div class="deal-card-seller">
          <div class="deal-card-seller-info">
            <img
              :src="
                deal.user?.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(deal.user?.name || 'User')}&background=6366f1&color=fff&size=32`
              "
              :alt="deal.user?.name || $t('deal.seller')"
              class="deal-card-seller-avatar"
            />
            <span class="deal-card-seller-name">{{ deal.user?.name || $t('deal.seller') }}</span>
          </div>
          <a :href="`/user/${deal.user_id}`" class="deal-card-seller-link" @click.stop>
            {{ $t('deal.seeProfile') }}
          </a>
        </div>

        <!-- Actions -->
        <div class="deal-card-actions">
          <Button
            variant="outline"
            size="sm"
            class="deal-card-action-button"
            as="a"
            :href="`/deals/${deal.id}`"
          >
            {{ $t('deal.seeDetails') }}
          </Button>
        </div>
      </div>
    </CardFooter>
  </Card>
</template>

<style scoped>
.deal-card {
  @apply flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl hover:-translate-y-1;
}

.deal-card-image-container {
  @apply relative overflow-hidden;
}

.deal-card-image {
  @apply h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110;
}

.deal-card-price-overlay {
  @apply absolute bottom-3 left-3;
}

.deal-card-price-container {
  @apply bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg;
}

.deal-card-price-label {
  @apply text-xs text-gray-600 font-medium;
}

.deal-card-price {
  @apply text-lg font-bold text-gray-900;
}

.deal-card-header {
  @apply pb-3;
}

.deal-card-header-content {
  @apply flex flex-col gap-3;
}

.deal-card-title {
  @apply text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-slate-700 transition-colors;
}

.deal-card-meta {
  @apply flex items-center gap-2 text-sm text-gray-500;
}

.deal-card-location-info {
  @apply flex items-center gap-1;
}

.deal-card-icon {
  @apply w-4 h-4;
}

.deal-card-separator {
  @apply text-gray-300;
}

.deal-card-date-info {
  @apply flex items-center gap-1;
}

.deal-card-content {
  @apply flex-1 pt-0;
}

.deal-card-description {
  @apply text-sm text-gray-600 line-clamp-2 mb-4;
}

.deal-card-products {
  @apply space-y-3;
}

.deal-card-products-header {
  @apply flex items-center justify-between text-sm;
}

.deal-card-products-title {
  @apply font-medium text-gray-700;
}

.deal-card-products-count {
  @apply text-xs;
}

.deal-card-products-list {
  @apply space-y-2 max-h-24 overflow-y-auto;
}

.deal-card-product-item {
  @apply flex justify-between items-center text-sm;
}

.deal-card-product-name {
  @apply text-gray-600 truncate flex-1 mr-2;
}

.deal-card-products-more {
  @apply text-xs text-gray-500 italic;
}

.deal-card-footer {
  @apply pt-4 border-t bg-gray-50/50;
}

.deal-card-footer-content {
  @apply flex flex-col gap-3 w-full;
}

.deal-card-seller {
  @apply flex items-center justify-between;
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

.deal-card-actions {
  @apply flex gap-2 w-full;
}

.deal-card-action-button {
  @apply flex-1;
}

.deal-card-action-icon {
  @apply w-4 h-4 mr-2;
}
</style>
