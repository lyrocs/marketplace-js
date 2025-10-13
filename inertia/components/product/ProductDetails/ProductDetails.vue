<script setup lang="ts">
import ProductDto from '#dtos/product'
import CategoryDto from '#dtos/category'

const props = defineProps<{
  product: ProductDto
  categories: CategoryDto[]
}>()

const parentCategory = props.categories.find(
  (category) => category.id === props.product.category.parentId
)
const breadcrumb = `${parentCategory?.name} / ${props.product.category.name} - ${props.product.brand.name}`
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12">
    <div class="space-y-8 lg:col-span-2">
      <ProductBreadcrumb :breadcrumb="breadcrumb" :title="product.name" />

      <ProductGallery :images="product.images" />

      <ProductSection title="Description">
        <p class="mt-4 leading-relaxed text-gray-700">
          {{ product.description }}
        </p>
      </ProductSection>

      <ProductSection v-if="product.features" title="Spécifications Techniques">
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
      </ProductSection>
    </div>

    <div class="mt-8 lg:col-span-1 lg:mt-0">
      <div class="space-y-6 lg:sticky lg:top-28">
        <ShopList :shops="product.shops" />

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
</template>
