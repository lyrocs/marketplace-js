<script setup lang="ts">
import { ref, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '~/layouts/AdminLayout.vue'
import GenericTable from '../../components/GenericTable.vue'
import CategoryDto from '#dtos/category'
defineOptions({ layout: AdminLayout })

const props = defineProps<{ categories: CategoryDto[] }>()
const newCategoryName = ref('')
const newCategoryParentId = ref<number | null>(null)
const newCategorySpecsTypes = ref<any>({})

function createCategory({ name, parentId, specsTypes }: { name: string, parentId: number | null, specsTypes: any }) {
    router.post('/admin/categories', { name, parentId, specsTypes }, {
        onSuccess: () => {
            newCategoryName.value = ''
            newCategoryParentId.value = null
        }
    })
}


function updateCategoryInline(rowIndex: number, item: CategoryDto) {
    router.put(`/admin/categories/${item.id}`, { name: item.name, parentId: item.parentId, specsTypes: item.specsTypes as any })
}
</script>

<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">Admin Categories</h1>
        <!-- Create Category Form -->

        <!-- Categories Table -->
        <GenericTable :items="props.categories" :columns="[
            { key: 'id', label: 'ID', editable: false },
            { key: 'name', label: 'Name' },
            { key: 'parentId', label: 'Parent', type: 'select', options: props.categories },
            { key: 'specsTypes', label: 'Specs Types', type: 'array' }
        ]" @update:item="({ rowIndex, item }) => updateCategoryInline(rowIndex, item)"
            @create:category="createCategory" />

    </div>
</template>
