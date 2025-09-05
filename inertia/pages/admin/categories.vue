<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import AdminLayout from '~/layouts/AdminLayout.vue'
import CategoryDto from '#dtos/category'
defineOptions({ layout: AdminLayout })

const props = defineProps<{ categories: CategoryDto[] }>()

function createCategory({ name, parentId, specsTypes = [] }: { name: string, parentId: number | null, specsTypes: any }) {
    router.post('/admin/categories', { name, parentId, specsTypes })
}

function updateCategoryInline(rowIndex: number, item: CategoryDto) {
    router.put(`/admin/categories/${item.id}`, { name: item.name, parentId: item.parentId, specsTypes: item.specsTypes as any })
}
function deleteCategoryInline(item: CategoryDto) {
    router.delete(`/admin/categories/${item.id}`)
}
</script>

<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">Admin Categories</h1>
        <AdminTable :items="props.categories" :columns="[
            { key: 'id', label: 'ID', editable: false },
            { key: 'name', label: 'Name' },
            { key: 'key', label: 'Key', editable: false },
            { key: 'parentId', label: 'Parent', type: 'select', options: props.categories },
            { key: 'specsTypes', label: 'Specs Types', type: 'array' }
        ]" @update:item="({ rowIndex, item }) => updateCategoryInline(rowIndex, item)" @create:item="createCategory"
            @delete:item="deleteCategoryInline" />

    </div>
</template>
