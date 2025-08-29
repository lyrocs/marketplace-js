<script setup lang="ts">
import AdminLayout from '~/layouts/AdminLayout.vue'
import ProductDto from '#dtos/product'
import CategoryDto from '#dtos/category'
import MetaDto from '#dtos/meta'
import SpecDto from '#dtos/spec'
import { usePage, router } from '@inertiajs/vue3'

defineOptions({
    layout: AdminLayout
})


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
const categoryParams = queryParams.category ? Number(queryParams.category) : null

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

function handleChangeCategory(id: number) {
    console.log('handleChangeCategory', id)
    const url = new URL(window.location.href)
    url.searchParams.delete('page')
    url.searchParams.delete('specs')
    url.searchParams.delete('category')
    if (id) {
        url.searchParams.set('category', id.toString())
    }

    router.get(url.toString())
}

</script>

<template>
    <div class="flex flex-col gap-4">
        <Filters @change="handleChange" @change:category="handleChangeCategory" :specs="specs"
            :selectedIds="specsParams" :categories="categories" :category="categoryParams" inline />
        <ul class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
            <li v-for="product in props.products" :key="product.id" class="flex gap-4 border bg-white p-2 rounded mb-2">
                <div class="flex items-center justify-center">
                    <img :src="product.images[0]" alt="" class="w-24 h-24 object-cover">
                </div>
                <div class="flex flex-col gap-2">
                    <h2 class="font-bold">{{ product.name }}</h2>

                    <p>{{ product.category.name }} - {{ product.brand.name }}</p>
                    <ul class="flex gap-2">
                        <li v-for="spec in product.specs" :key="spec.id">
                            <Badge>{{ spec.type }}: {{ spec.value }}</Badge>
                        </li>
                    </ul>
                    <div class="flex gap-2">
                        <div>
                            <Badge :variant="product.status === 'PENDING' ? 'destructive' : 'secondary'">{{
                                product.status
                            }}
                            </Badge>
                        </div>
                        <div v-for="translation in product.translations" :key="translation.id" class="">
                            <p>
                                <Badge>{{ translation.language }}</Badge>
                            </p>
                        </div>
                        <div v-for="shop in product.shops" :key="shop.id" class="flex gap-4">
                            <p>
                                <Badge :class="shop.available ? 'bg-green-500' : 'bg-red-500'">{{ shop.shop }} - {{
                                    shop.price }} {{ shop.currency }}</Badge>
                            </p>
                        </div>
                    </div>
                </div>

            </li>
        </ul>
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
</template>