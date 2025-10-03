<script setup lang="ts">
import { IconLocationOnOutline, IconHandshakeOutline } from '@iconify-prerendered/vue-material-symbols'

interface Seller {
  name: string
  avatar: string
  location: string
}

interface Props {
  seller: Seller
}

defineProps<Props>()
</script>

<template>
  <div class="seller-card">
    <h3 class="seller-card-title">Vendeur et modalités</h3>
    <div class="seller-info">
      <img :src="seller.avatar" alt="avatar" class="seller-avatar" />
      <div>
        <a href="#" class="seller-name">{{ seller.name }}</a>
        <div class="seller-rating">
          <slot name="rating" />
        </div>
      </div>
    </div>
    <div class="seller-details">
      <div class="seller-detail-item">
        <IconLocationOnOutline class="text-lg" />
        <span>Situé à {{ seller.location }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.seller-card {
  @apply bg-white rounded-xl shadow-lg p-6;
}

.seller-card-title {
  @apply font-bold text-lg text-gray-800 mb-3;
}

.seller-info {
  @apply flex items-center gap-4;
}

.seller-avatar {
  @apply w-16 h-16 rounded-full;
}

.seller-name {
  @apply font-semibold text-gray-800 hover:text-slate-600;
}

.seller-rating {
  @apply mt-1;
}

.seller-details {
  @apply text-sm text-gray-600 space-y-3 mt-4 pt-4 border-t;
}

.seller-detail-item {
  @apply flex items-center gap-2;
}
</style>
