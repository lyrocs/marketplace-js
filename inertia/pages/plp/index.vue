<script setup lang="ts">
import CategoryDto from '#dtos/category';
import ProductDto from '#dtos/product';
import MetaDto from '#dtos/meta';
import SpecDto from '#dtos/spec';
import DealDto from '#dtos/deal';

import { usePage, router } from '@inertiajs/vue3'


const props = defineProps<{
  categories: CategoryDto[]
  products: ProductDto[]
  deals: DealDto[]
  meta: MetaDto,
  specs: SpecDto[]
  category: string
  isDeal: boolean
}>()

const page = usePage()
const queryString = page.url.split('?')[1] || '';
const searchParams = new URLSearchParams(queryString);
const queryParams = Object.fromEntries(searchParams.entries());
const specsParams = queryParams.specs?.split(',').map(Number) || []

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
</script>

<template>
  <main class="container mx-auto px-4 py-2">
    <!-- V3  -->
    <section class="relative h-72 overflow-hidden rounded-2xl bg-slate-800">
      <img
        :src="isDeal ? 'https://kwadmarket-images.s3.eu-west-3.amazonaws.com/public/banner-deal.png' : 'https://kwadmarket-images.s3.eu-west-3.amazonaws.com/public/banner-new.png'"
        alt="Vue aérienne d'une forêt" class="absolute inset-0 size-full object-cover opacity-40" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
      <div class="relative flex h-full flex-col items-center justify-center p-4 text-center">
        <h1 class="text-shadow text-4xl font-extrabold text-white md:text-5xl">Trouvez votre produit</h1>
        <p class="text-shadow-sm mt-2 max-w-2xl text-lg text-slate-200">Explorez les annonces de passionnés ou le
          catalogue des produits neufs.</p>
        <div class="mt-8">
          <div class="inline-flex items-center rounded-lg border border-white/10 bg-slate-900/50 p-1 backdrop-blur-sm">
            <button @click="redirectDeal" class="rounded-md px-5 py-2 text-sm font-semibold text-slate-100 shadow-lg"
              :class="isDeal ? 'bg-white text-slate-800 hover:bg-white' : 'bg-slate-900 text-white hover:bg-slate-800'">
              Annonces d'Occasion
            </button>
            <button @click="redirectNew"
              class="rounded-md px-5 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
              :class="isDeal ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-800 hover:bg-white'">
              Catalogue Neuf
            </button>
          </div>
        </div>
      </div>
    </section>
    <div class="grid grid-cols-1 lg:grid-cols-4 lg:gap-x-12 mt-6">
      <div class="flex flex-col gap-4">
        <h3 class="text-xl font-bold text-gray-800">Filtres pour les annonces</h3>
        <Filters @change="handleChange" :specs="specs" :selectedIds="specsParams" />
      </div>
      <div class="mt-8 lg:col-span-3 lg:mt-0">
        <!-- <div class="mb-6 flex items-center justify-between">
          <p class="text-gray-600">
            Affichage de
            <span class="font-semibold">12</span>

            résultats
          </p>
          <select class="rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500">
            <option>Trier par : Le plus récent</option>
            <option>Trier par : Prix croissant</option>
            <option>Trier par : Prix décroissant</option>
          </select>
        </div> -->
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 mb-6">
          <template v-if="isDeal">
            <DealCard v-for="deal in deals" :key="deal.id" :deal="deal" />
          </template>
          <ProductCard v-else v-for="product in products" :key="product.id" :product="product" />
        </div>
        <Pagination v-slot="{ page }" :items-per-page="meta.perPage" :total="meta.total"
          :default-page="meta.currentPage">
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious />

            <template v-for="(item, index) in items" :key="index">
              <PaginationItem @click="handleChangePage(item.value)" v-if="item.type === 'page'" :value="item.value"
                :is-active="item.value === page">
                {{ item.value }}
              </PaginationItem>
            </template>

            <!-- <PaginationEllipsis :index="4" /> -->

            <PaginationNext />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  </main>
</template>
