<script setup lang="ts">
import { ref } from 'vue'
import CategoryDto from '#dtos/category'
import SpecDto from '#dtos/spec'
import ProductDto from '#dtos/product'
import MetaDto from '#dtos/meta'
import DealDto from '#dtos/deal'
import { usePage, router } from '@inertiajs/vue3'

const props = defineProps<{
  categories: CategoryDto[]
  specs: SpecDto[]
  products: ProductDto[]
  deal: DealDto
  meta: MetaDto
}>()

const page = usePage()
const queryString = page.url.split('?')[1] || ''
const searchParams = new URLSearchParams(queryString)
const queryParams = Object.fromEntries(searchParams.entries())
const specsParams = queryParams.specs?.split(',').map(Number) || []
const categoryParams = queryParams.category ? Number(queryParams.category) : null
const product = ref<ProductDto | null>(null)

function handleChange(ids: number[]) {
  const url = new URL(window.location.href)
  url.searchParams.delete('page')
  url.searchParams.delete('specs')
  if (ids && ids.length) {
    url.searchParams.set('specs', ids.join(','))
  }
  router.get(url.toString())
}

function handleChangeCategory(id: number) {
  const url = new URL(window.location.href)
  url.searchParams.delete('page')
  url.searchParams.delete('specs')
  url.searchParams.delete('category')
  if (id) {
    url.searchParams.set('category', id.toString())
  }
  router.get(url.toString())
}

function handleProductSelect(product: ProductDto) {
  router.post(`/deals/${props.deal.id}/add-product`, { product_id: product.id })
}

function handleProductSeeDetails(selectedProduct: ProductDto) {
  product.value = selectedProduct
}

function closeModal() {
  product.value = null
}

function handleChangePage(value: number) {
  const url = new URL(window.location.href)
  url.searchParams.set('page', value.toString())
  router.get(url.toString())
}
</script>

<template>
  <div class="flex md:flex-row flex-col gap-4">
    <FilterSidebar
      :specs="specs"
      :selected-ids="specsParams"
      :category="categoryParams"
      :categories="categories"
      @change="handleChange"
      @change:category="handleChangeCategory"
      class="min-w-64"
    />
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        <ProductCard
          v-for="product in props.products"
          :key="product.id"
          :product="product"
          :selectable="true"
          :selected="props.deal.products.some((p) => p.id === product.id)"
          @select="handleProductSelect"
          @seeDetails="handleProductSeeDetails"
        />
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
    <Dialog
      v-if="product !== null"
      :open="product !== null"
      @update:open="(open: boolean) => !open && closeModal()"
    >
      <DialogContent class="max-w-1/2 m-12 w-3/4 h-3/4 overflow-auto" @close="closeModal">
        <ProductDetails :product="product" :categories="categories" class="overflow-auto" />
      </DialogContent>
    </Dialog>
  </div>
</template>
