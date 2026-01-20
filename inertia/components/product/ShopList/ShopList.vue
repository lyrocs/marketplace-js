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
  <div class="rounded-xl bg-white p-6 shadow-lg">
    <h3 class="mb-4 text-lg font-bold text-gray-800">{{ title }}</h3>
    <div class="space-y-3">
      <a
        v-for="shop in shops"
        :key="shop.id"
        :href="shop.url"
        class="flex items-center justify-between gap-4 rounded-lg border p-3 hover:bg-slate-50"
      >
        <div class="flex flex-col gap-1 min-w-0">
          <span class="font-semibold text-slate-800 truncate">{{ shop.name }}</span>
          <span
            class="w-fit rounded-full px-2 py-0.5 text-xs font-semibold"
            :class="shop.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
          >
            {{ shop.available ? 'Disponible' : 'Non disponible' }}
          </span>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <p class="text-xl font-bold text-slate-800">
            {{ shop.price }} {{ getCurrencySymbol(shop.currency) }}
          </p>
          <i class="ri-external-link-line text-slate-400"></i>
        </div>
      </a>
    </div>
  </div>
</template>
