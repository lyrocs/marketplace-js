<script setup lang="ts">
interface Props {
  product: any
  selectable?: boolean
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  selected: false,
})

const emit = defineEmits<{
  select: [product: any]
  seeDetails: [product: any]
}>()
</script>

<template>
  <a
    :href="selectable ? '#' : `/product/${product.id}`"
    class="flex flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-200 group"
  >
    <img
      :src="
        product.images ? product.images[0] : 'https://placehold.co/400x300/475569/white?text=Image'
      "
      class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
      alt="Product image"
    />
    <div class="flex grow flex-col p-4">
      <h3 class="my-2 text-lg font-bold text-gray-800 hover:text-slate-600 overflow-hidden">
        {{ product.name }}
      </h3>
      <div class="flex flex-wrap gap-2">
        <!-- <p>{{ product.brand.name }}</p> -->
        <template v-if="product.specs.length > 0">
          <p class="text-sm flex gap-1">{{ $t('product.specs') }}:</p>
          <ul v-for="spec in product.specs" :key="spec.id" class="tag flex gap-1 h-5">
            <li>{{ spec.value }}</li>
          </ul>
        </template>
      </div>
      <div class="flex-1 flex flex-col border-t mt-2">
        <div
          v-for="shop in product.shops"
          :key="shop.id"
          class="flex items-center justify-between py-2 border-b last:border-b-0"
        >
          <div class="flex flex-col gap-1 min-w-0">
            <span class="text-sm font-medium text-gray-700 truncate">{{ shop.name }}</span>
            <span class="tag text-xs w-fit">
              {{ shop.available ? $t('product.available') : $t('product.unavailable') }}
            </span>
          </div>
          <p class="text-lg font-bold text-gray-900 shrink-0 pl-2">
            {{ shop.price }} {{ shop.currency === 'EUR' ? '€' : '$' }}
          </p>
        </div>
        <div class="flex items-center justify-end gap-2 pt-2">
          <Button @click="emit('seeDetails', product)">{{ $t('product.seeDetails') }}</Button>
          <Button
            v-if="selectable"
            @click="emit('select', product)"
            :variant="selected ? 'ghost' : 'secondary'"
            :disabled="selected"
          >
            {{ selected ? $t('product.selected') : $t('product.select') }}
          </Button>
        </div>
      </div>
    </div>
  </a>
</template>
