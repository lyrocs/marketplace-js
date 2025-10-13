<script setup lang="ts">
defineProps<{ product: any }>()
</script>

<template>
    <a :href="`/product/${product.id}`" class="group flex flex-col overflow-hidden rounded-xl bg-white shadow-lg">
        <img :src="product.images ? product.images[0] : 'https://placehold.co/400x300/475569/white?text=Image'"
            class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            alt="Product image" />
        <!-- <img src="https://placehold.co/400x300/475569/white?text="
            class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            alt="Product image" /> -->
        <div class="flex grow flex-col p-4">
            <h3 class="my-2 h-14 text-lg font-bold text-gray-800 hover:text-slate-600 overflow-hidden">{{ product.name }}</h3>
            <div class="flex gap-4">
                <!-- <p>{{ product.brand.name }}</p> -->
                <p class="text-sm flex gap-1">
                    Specs:
                <ul v-for="spec in product.specs" :key="spec.id" class="tag flex gap-1">
                    <li>{{ spec.value }}</li>
                </ul>
                </p>
            </div>
            <div class="flex-1 flex gap-4 border-t mt-2">
                <div v-for="shop in product.shops" :key="shop.id" class="mt-2 flex flex-col items-center gap-2  py-2">
                    <img src="data:image/png;base64,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"
                        class="size-8 rounded-full" alt="avatar" />
                    <span
                        class="tag">
                        {{ shop.available ? "Disponible" : "Non disponible" }}
                    </span>
                    <p class="text-2xl font-bold text-gray-900 flex-1 text-right">{{ shop.price }} {{ shop.currency ===
                        "EUR" ? "€" : "$" }}</p>
                </div>
                <div class="flex-1 flex items-end justify-end gap-2">
                    <Button>Voir details</Button>
                </div>
            </div>
        </div>
    </a>
</template>