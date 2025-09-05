<script setup lang="ts">
import AdminLayout from '~/layouts/AdminLayout.vue'
import ProductDto from '#dtos/product'
import CategoryDto from '#dtos/category'
import MetaDto from '#dtos/meta'
import SpecDto from '#dtos/spec'
import { usePage, router } from '@inertiajs/vue3'
import {
    IconAdd
} from '@iconify-prerendered/vue-material-symbols'
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
    const url = new URL(window.location.href)
    url.searchParams.delete('page')
    url.searchParams.delete('specs')
    url.searchParams.delete('category')
    if (id) {
        url.searchParams.set('category', id.toString())
    }

    router.get(url.toString())
}

function createProduct() {
    router.get('/admin/product/create')
}

</script>

<template>
    <div class="flex flex-col gap-4">
        <Filters @change="handleChange" @change:category="handleChangeCategory" :specs="specs"
            :selectedIds="specsParams" :categories="categories" :category="categoryParams" inline />
        <Button @click="createProduct">
            <IconAdd class="size-12" />Create Product
        </Button>
        <ul class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
            <li v-for="product in props.products" :key="product.id">
                <a :href="`/admin/product/${product.id}`" class="flex gap-4 border bg-white p-2 rounded mb-2 min-h-36">
                    <div class="flex items-center justify-center">
                        <img :src="product.images[0]" alt="" class="w-24 h-24 object-cover">
                    </div>
                    <div class="flex-1 flex flex-col justify-between w-full gap-2">
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
                            <div v-for="shop in product.shops" :key="shop.id" class="flex gap-4">
                                <p>
                                    <Badge :class="shop.available ? 'bg-green-500' : 'bg-red-500'">{{ shop.name }} - {{
                                        shop.price }} {{ shop.currency }}</Badge>
                                </p>
                            </div>
                        </div>
                    </div>
                </a>
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