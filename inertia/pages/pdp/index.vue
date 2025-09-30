<script setup lang="ts">
import { ref } from 'vue'
import ProductDto from '#dtos/product';
import CategoryDto from '#dtos/category';

const props = defineProps<{
    product: ProductDto
    categories: CategoryDto[]
}>()

const parentCategory = props.categories.find((category) => category.id === props.product.category.parentId)

const selectedImageIndex = ref(0)
const defaultImage = 'https://placehold.co/400x300/475569/white?text=Image'
const productImages = props.product.images && props.product.images.length > 0
    ? props.product.images
    : [defaultImage]
</script>

<template>
    <main class=" container  mx-auto bg-slate-100/50 px-4 py-8 md:py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12">
            <div class="space-y-8 lg:col-span-2">
                <div>
                    <span class="text-sm font-medium text-slate-600">{{ parentCategory?.name }} / {{
                        product.category.name }} - {{ product.brand.name }}</span>
                    <h1 class="mt-1 text-4xl font-bold text-gray-800 md:text-5xl">{{ product.name }}</h1>
                </div>

                <div class="rounded-xl bg-white p-4 shadow-lg">
                    <img :src="productImages[selectedImageIndex]" class="size-full rounded-lg object-cover"
                        alt="Image principale du produit" />

                    <div v-if="productImages.length > 1" class="mt-4 flex gap-2 overflow-x-auto">
                        <button v-for="(image, index) in productImages" :key="index" @click="selectedImageIndex = index"
                            :class="[
                                'flex-shrink-0 rounded-lg border-2 transition-all',
                                selectedImageIndex === index
                                    ? 'border-slate-600 ring-2 ring-slate-300'
                                    : 'border-transparent hover:border-slate-300'
                            ]">
                            <img :src="image" class="h-20 w-20 rounded-lg object-cover"
                                :alt="`Image ${index + 1} du produit`" />
                        </button>
                    </div>
                </div>

                <div class="rounded-xl bg-white p-6 shadow-lg md:p-8">
                    <h2 class="text-2xl font-bold text-gray-800">Description</h2>
                    <p class="mt-4 leading-relaxed text-gray-700">
                        {{ product.description }}
                    </p>
                </div>

                <div v-if="product.features" class="rounded-xl bg-white p-6 shadow-lg md:p-8">
                    <h2 class="text-2xl font-bold text-gray-800">Spécifications Techniques</h2>
                    <div class="mt-6 space-y-6">
                        <div v-for="feature of product.features" :key="feature.title">
                            <h3 class="mb-3 border-b pb-2 text-lg font-bold text-gray-800">{{ feature.title }}</h3>
                            <dl v-for="item of feature.items" :key="feature.title" class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <dt class="text-gray-600">{{ item.split(':')[0] }}</dt>
                                    <dd class="font-semibold text-gray-800">{{ item.split(':')[1] }}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8 lg:col-span-1 lg:mt-0">
                <div class="space-y-6 lg:sticky lg:top-28">

                    <div class="rounded-xl bg-white p-6 shadow-lg">
                        <h3 class="mb-4 text-lg font-bold text-gray-800">Shop disponible</h3>
                        <div class="space-y-3">
                            <a v-for="shop in product.shops" :key="shop.id" :href="shop.url"
                                class="flex items-center gap-4 rounded-lg border p-3 hover:bg-slate-50">
                                <span
                                    class="inline-block w-fit rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-800">
                                    {{ shop.name }}
                                </span>
                                <span class="inline-block w-fit rounded-full px-2 py-0.5 text-xs font-semibold"
                                    :class="shop.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                                    {{ shop.available ? "Disponible" : "Non disponible" }}
                                </span>
                                <div class="grow text-right">
                                    <p class="text-xl font-bold text-slate-800">{{ shop.price }} {{ shop.currency
                                        ===
                                        'EUR' ? '€' : '$' }}</p>
                                </div>
                                <i class="ri-external-link-line text-slate-400"></i>
                            </a>
                        </div>
                    </div>

                    <!-- TODO V3
                     <div class="rounded-xl bg-white p-6 shadow-lg">
                        <h3 class="mb-4 text-lg font-bold text-gray-800">Disponible d'occasion sur DroneMarket</h3>
                        <div class="space-y-4">
                            <a href="#" class="flex items-center gap-3 rounded-lg border p-3 hover:bg-slate-50">
                                <img src="https://i.pravatar.cc/40" class="size-10 rounded-full" alt="avatar" />
                                <div class="grow">
                                    <p class="font-semibold text-gray-800">Fly More Combo</p>
                                    <p class="text-sm text-gray-500">
                                        Par Julien78 &bull;
                                        <span class="font-medium text-green-600">Très bon état</span>
                                    </p>
                                </div>
                                <p class="text-lg font-bold text-slate-800">650 €</p>
                            </a>
                            <a href="#" class="flex items-center gap-3 rounded-lg border p-3 hover:bg-slate-50">
                                <img src="https://i.pravatar.cc/40?u=marc" class="size-10 rounded-full" alt="avatar" />
                                <div class="grow">
                                    <p class="font-semibold text-gray-800">Drone seul</p>
                                    <p class="text-sm text-gray-500">
                                        Par Marc_FPV &bull;
                                        <span class="font-medium text-orange-600">Bon état</span>
                                    </p>
                                </div>
                                <p class="text-lg font-bold text-slate-800">520 €</p>
                            </a>
                            <div class="pt-2 text-center">
                                <a href="#" class="text-sm font-semibold text-slate-600 hover:text-slate-800">Voir les 6
                                    autres annonces &rarr;</a>
                            </div>
                        </div>
                    </div> -->

                </div>
            </div>
        </div>
    </main>
</template>