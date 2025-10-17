<script setup lang="ts">
import CategoryDto from '#dtos/category'
import ProductDto from '#dtos/product'
import MetaDto from '#dtos/meta'
import SpecDto from '#dtos/spec'
import DealDto from '#dtos/deal'
import { computed } from 'vue'

import { usePage, router } from '@inertiajs/vue3'

const props = defineProps<{
  categories: CategoryDto[]
  products: ProductDto[]
  deals: DealDto[]
  meta: MetaDto
  specs: SpecDto[]
  category: string
  isDeal: boolean
  search?: string
}>()

const page = usePage()
const queryString = page.url.split('?')[1] || ''
const searchParams = new URLSearchParams(queryString)
const queryParams = Object.fromEntries(searchParams.entries())
const specsParams = queryParams.specs?.split(',').map(Number) || []

const currentCategory = computed(() => {
  return props.categories.find((category) => category.key === props.category)
})

function handleChangePage(value: number) {
  const url = new URL(window.location.href)
  url.searchParams.set('page', value.toString())
  router.get(url.toString())
}

function handleChange(ids: number[]) {
  const url = new URL(window.location.href)
  url.searchParams.delete('page')
  url.searchParams.delete('specs')
  if (ids && ids.length) {
    url.searchParams.set('specs', ids.join(','))
  }
  router.get(url.toString())
}

function redirectNew() {
  if (props.isDeal) {
    router.get(`/products/${props.category}`)
  }
}

function redirectDeal() {
  if (!props.isDeal) {
    router.get(`/products/${props.category}/deal`)
  }
}

function handleChangeCategory(id: number) {
  const category = props.categories.find((category) => category.id === id)
  router.get(`/products/${category?.key}${props.isDeal ? '/deal' : ''}`)
}

function handleChangeSearch(search: string) {
  const url = new URL(window.location.href)
  url.searchParams.delete('page')
  if (search) {
    url.searchParams.set('search', search)
  } else {
    url.searchParams.delete('search')
  }
  router.get(url)
}
</script>

<template>
  <main class="container mx-auto px-4 py-2">
    <PageBanner
      :title="$t('plp.title')"
      :description="$t('plp.description')"
      :background-image="
        isDeal
          ? 'https://kwadmarket-images.s3.eu-west-3.amazonaws.com/public/banner-deal.png'
          : 'https://kwadmarket-images.s3.eu-west-3.amazonaws.com/public/banner-new.png'
      "
    >
      <ToggleSwitch
        :left-label="$t('plp.leftLabel')"
        :right-label="$t('plp.rightLabel')"
        :is-left-active="isDeal"
        @click-left="redirectDeal"
        @click-right="redirectNew"
      />
    </PageBanner>
    <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:gap-x-12 mt-6">
      <FilterSidebar
        :title="$t('plp.filters')"
        :specs="specs"
        :selected-ids="specsParams"
        :category="currentCategory?.id || undefined"
        :categories="categories"
        :search="search"
        @change="handleChange"
        @change:category="handleChangeCategory"
        @change:search="handleChangeSearch"
      />
      <div class="mt-8 lg:col-span-2 xl:col-span-3 2xl:col-span-4 lg:mt-0">
        <div
          class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-6"
        >
          <template v-if="isDeal">
            <DealCard v-for="deal in deals" :key="deal.id" :deal="deal" />
          </template>
          <ProductCard v-else v-for="product in products" :key="product.id" :product="product" />
        </div>
        <Pagination
          v-slot="{ page }"
          :items-per-page="meta.perPage"
          :total="meta.total"
          :default-page="meta.currentPage"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious />
            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                @click="handleChangePage(item.value)"
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === page"
              >
                {{ item.value }}
              </PaginationItem>
            </template>
            <PaginationNext />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  </main>
</template>
