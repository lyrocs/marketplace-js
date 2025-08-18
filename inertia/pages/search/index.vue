<script setup lang="ts">
import ProductDto from '#dtos/product';
import CategoryDto from '#dtos/category';
import MetaDto from '#dtos/meta';
import { router } from '@inertiajs/vue3'

const props = defineProps<{
    products: ProductDto[]
    categories: CategoryDto[]
    meta: MetaDto,
    name: string
}>()

function handleChangePage(value: number) {
    const url = new URL(window.location.href)
    url.searchParams.set('page', value.toString())
    router.get(url.toString())
}

</script>

<template>
    <main class="container mx-auto px-4 py-2">
        <div class="grid grid-cols-1 lg:grid-cols-4 lg:gap-x-12">
            <div class="mt-8 lg:col-span-4 lg:mt-0">
                <div class="mb-6 flex items-center justify-between">
                    <p class="text-gray-600">Recherche de "{{ name }}"</p>
                    <p class="text-gray-600">
                        Affichage de
                        <span class="font-semibold">{{ meta.total }}</span>
                        résultats
                    </p>
                </div>
                <div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                    <ProductCard v-for="product in products" :key="product.id" :product="product" />
                </div>
                <Pagination v-slot="{ page }" :items-per-page="meta.perPage" :total="meta.total"
                    :default-page="meta.currentPage">
                    <PaginationContent v-slot="{ items }">
                        <PaginationPrevious />
                        <template v-for="(item, index) in items" :key="index">
                            <PaginationItem @click="handleChangePage(item.value)" v-if="item.type === 'page'"
                                :value="item.value" :is-active="item.value === page">
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