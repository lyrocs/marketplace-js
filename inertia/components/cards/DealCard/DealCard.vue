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
  <Card
    class="flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl hover:-translate-y-1 group"
  >
    <!-- Image Header with overlays -->
    <div class="relative overflow-hidden">
      <img
        :src="firstProductImage"
        class="h-48 w-full object-contain transition-transform duration-500 group-hover:scale-110"
        :alt="`${deal.title} deal image`"
      />

      <!-- Price Overlay -->
      <div class="absolute bottom-3 left-3">
        <div class="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div class="text-xs text-gray-600 font-medium">{{ $t('deal.totalPrice') }}</div>
          <div class="text-lg font-bold text-gray-900">{{ deal.price }} {{ currencySymbol }}</div>
        </div>
      </div>
    </div>

    <!-- Card Header -->
    <CardHeader class="pb-3">
      <div class="flex flex-col gap-3">
        <h3
          class="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-slate-700 transition-colors"
        >
          {{ deal.title }}
        </h3>

        <div class="flex items-center gap-2 text-sm text-gray-500">
          <div class="flex items-center gap-1">
            <IconLocationOnOutline class="w-4 h-4" />
            <span>{{ deal.location || $t('deal.noLocation') }}</span>
          </div>

          <span class="text-gray-300">•</span>

          <div class="flex items-center gap-1">
            <IconCalendarMonth class="w-4 h-4" />
            <span>{{ formatDate(deal.createdAt) }}</span>
          </div>
        </div>
      </div>
    </CardHeader>

    <!-- Card Content -->
    <CardContent class="flex-1 pt-0">
      <p class="text-sm text-gray-600 line-clamp-2 mb-4">
        {{ deal.description || $t('deal.noDescription') }}
      </p>

      <!-- Products Summary -->
      <div class="space-y-3">
        <div class="flex items-center justify-between text-sm">
          <span class="font-medium text-gray-700">{{ $t('deal.includes') }}</span>
          <Badge variant="outline" class="text-xs">
            {{ $t('deal.numberArticle', { count: totalProducts }) }}
          </Badge>
        </div>

        <div class="space-y-2 max-h-24 overflow-y-auto">
          <div
            v-for="product in deal.products?.slice(0, 2)"
            :key="product.id"
            class="flex justify-between items-center text-sm"
          >
            <span class="text-gray-600 truncate flex-1 mr-2"
              >{{ product.quantity }}x {{ product.name }}</span
            >
          </div>

          <div
            v-if="deal.products && deal.products.length > 2"
            class="text-xs text-gray-500 italic"
          >
            {{ $t('deal.moreProduct', { count: deal.products.length - 2 }) }}
          </div>
        </div>
      </div>
    </CardContent>

    <!-- Card Footer -->
    <CardFooter class="pt-4 border-t bg-gray-50/50">
      <div class="flex flex-col gap-3 w-full">
        <!-- Seller Info -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <img
              :src="
                deal.user?.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(deal.user?.name || 'User')}&background=6366f1&color=fff&size=32`
              "
              :alt="deal.user?.name || $t('deal.seller')"
              class="w-6 h-6 rounded-full"
            />
            <span class="text-sm text-gray-600">{{ deal.user?.name || $t('deal.seller') }}</span>
          </div>
          <a
            :href="`/user/${deal.user_id}`"
            class="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            @click.stop
          >
            {{ $t('deal.seeProfile') }}
          </a>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 w-full">
          <Button variant="outline" size="sm" class="flex-1" as="a" :href="`/deals/${deal.id}`">
            {{ $t('deal.seeDetails') }}
          </Button>
        </div>
      </div>
    </CardFooter>
  </Card>
</template>
