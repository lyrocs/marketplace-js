<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import AdminLayout from '~/layouts/AdminLayout.vue'
import BrandDto from '#dtos/brand'
defineOptions({ layout: AdminLayout })

const props = defineProps<{ brands: BrandDto[] }>()

function createBrand({ name }: { name: string }) {
  router.post('/admin/brands', { name })
}

function updateBrandInline(rowIndex: number, item: BrandDto) {
  router.put(`/admin/brands/${item.id}`, { name: item.name })
}
function deleteBrandInline(item: BrandDto) {
  router.delete(`/admin/brands/${item.id}`)
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Admin Brands</h1>
    <AdminTable :items="props.brands" :columns="[
      { key: 'id', label: 'ID', editable: false },
      { key: 'name', label: 'Name' },
    ]" @update:item="({ rowIndex, item }) => updateBrandInline(rowIndex, item)" @create:item="createBrand"
      @delete:item="deleteBrandInline" />

  </div>
</template>