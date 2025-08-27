<script setup lang="ts">
import { ref, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import AdminLayout from '~/layouts/AdminLayout.vue'
import GenericTable from '../../components/GenericTable.vue'
import CategoryDto from '#dtos/category'
import { IconAdd } from '@iconify-prerendered/vue-material-symbols'
defineOptions({ layout: AdminLayout })

const props = defineProps<{ categories: CategoryDto[] }>()
const newCategoryName = ref('')
const newCategoryParentId = ref<number | null>(null)
const newCategorySpecsTypes = ref<any>({})

function createCategory() {
    router.post('/admin/categories', { name: newCategoryName.value, parentId: newCategoryParentId.value, specsTypes: {} }, {
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
        <form @submit.prevent="createCategory" class="flex gap-2 mb-6 items-center bg-white rounded-lg p-2">
            <label for=" newCategoryName">Name:</label>
            <input v-model="newCategoryName" type="text" placeholder="New category name" class="input input-bordered"
                required />
            <label for="newCategoryParentId">Parent:</label>
            <select v-model="newCategoryParentId" class="select select-bordered">
                <option :value="null">No parent</option>
                <option v-for="cat in props.categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                </option>
            </select>
            <TagsInput v-model="newCategorySpecsTypes">
                <TagsInputItem v-for="item in newCategorySpecsTypes" :key="item" :value="item">
                    <TagsInputItemText />
                    <TagsInputItemDelete />
                </TagsInputItem>

                <TagsInputInput placeholder="Specs..." />
            </TagsInput>
            <Button type="submit" class="bg-green-500 hover:bg-green-600">
                <IconAdd class="h-6 w-6" /> Add
            </Button>
        </form>
        <!-- Categories Table -->
        <GenericTable :items="props.categories" :columns="[
            { key: 'id', label: 'ID', editable: false },
            { key: 'name', label: 'Name' },
            { key: 'parentId', label: 'Parent', type: 'select', options: props.categories },
            { key: 'specsTypes', label: 'Specs Types', type: 'array' }
        ]" @update:item="({ rowIndex, item }) => updateCategoryInline(rowIndex, item)" />

    </div>
</template>
