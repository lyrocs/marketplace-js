<script setup lang="ts">
interface Shop {
  id: number
  name: string
  url: string
  price: number
  currency: string
  available: boolean
}

interface Props {
  shops: Shop[]
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Shop disponible',
})

const getCurrencySymbol = (currency: string) => {
  return currency === 'EUR' ? '€' : '$'
}
</script>

<template>
  <div class="shop-list-container">
    <h3 class="shop-list-title">{{ title }}</h3>
    <div class="shop-list">
      <a
        v-for="shop in shops"
        :key="shop.id"
        :href="shop.url"
        class="shop-item"
      >
        <span class="shop-name">{{ shop.name }}</span>
        <span
          class="shop-availability"
          :class="shop.available ? 'shop-available' : 'shop-unavailable'"
        >
          {{ shop.available ? 'Disponible' : 'Non disponible' }}
        </span>
        <div class="shop-price-container">
          <p class="shop-price">{{ shop.price }} {{ getCurrencySymbol(shop.currency) }}</p>
        </div>
        <i class="ri-external-link-line text-slate-400"></i>
      </a>
    </div>
  </div>
</template>

<style scoped>
.shop-list-container {
  @apply rounded-xl bg-white p-6 shadow-lg;
}

.shop-list-title {
  @apply mb-4 text-lg font-bold text-gray-800;
}

.shop-list {
  @apply space-y-3;
}

.shop-item {
  @apply flex items-center gap-4 rounded-lg border p-3 hover:bg-slate-50;
}

.shop-name {
  @apply inline-block w-fit rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-800;
}

.shop-availability {
  @apply inline-block w-fit rounded-full px-2 py-0.5 text-xs font-semibold;
}

.shop-available {
  @apply bg-green-100 text-green-800;
}

.shop-unavailable {
  @apply bg-red-100 text-red-800;
}

.shop-price-container {
  @apply grow text-right;
}

.shop-price {
  @apply text-xl font-bold text-slate-800;
}
</style>
