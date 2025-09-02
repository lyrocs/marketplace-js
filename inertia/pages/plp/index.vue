<script setup lang="ts">
import CategoryDto from '#dtos/category';
import ProductDto from '#dtos/product';
import MetaDto from '#dtos/meta';
import SpecDto from '#dtos/spec';
import { usePage, router } from '@inertiajs/vue3'


const props = defineProps<{
  categories: CategoryDto[]
  products: ProductDto[]
  meta: MetaDto,
  specs: SpecDto[]
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
</script>

<template>
  <main class="container mx-auto px-4 py-2">
    <!-- V3  -->
    <!-- <section class="relative h-72 overflow-hidden rounded-2xl bg-slate-800">
        <img src="https://images.unsplash.com/photo-1505851505423-74695098415a?q=80&w=2070&auto=format&fit=crop" alt="Vue aérienne d'une forêt" class="absolute inset-0 size-full object-cover opacity-40" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
        <div class="relative flex h-full flex-col items-center justify-center p-4 text-center">
          <h1 class="text-shadow text-4xl font-extrabold text-white md:text-5xl">Trouvez votre drone</h1>
          <p class="text-shadow-sm mt-2 max-w-2xl text-lg text-slate-200">Explorez les annonces de passionnés ou le catalogue des produits neufs.</p>
          <div class="mt-8">
            <div class="inline-flex items-center rounded-lg border border-white/10 bg-slate-900/50 p-1 backdrop-blur-sm">
              <button class="rounded-md bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-lg">
                Annonces d'Occasion
              </button>
              <button class="rounded-md px-5 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10">
                Catalogue Neuf
              </button>
            </div>
          </div>
        </div>
      </section> -->
    <div class="grid grid-cols-1 lg:grid-cols-4 lg:gap-x-12">
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
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
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
