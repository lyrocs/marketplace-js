<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import AdminLayout from '~/layouts/AdminLayout.vue'
import SpecDto from '#dtos/spec'
import SpecTypeDto from '#dtos/spec_type'
defineOptions({ layout: AdminLayout })

const props = defineProps<{ specs: SpecDto[], types: SpecTypeDto[] }>()

function createSpec({ spec_type_id, value }: { spec_type_id: number, value: string }) {
    router.post('/admin/specs', { specTypeId: spec_type_id, value })
}

function updateSpecInline(rowIndex: number, item: SpecDto) {
    router.put(`/admin/specs/${item.id}`, { specTypeId: item.spec_type_id, value: item.value })
}
function deleteSpecInline(item: SpecDto) {
    router.delete(`/admin/specs/${item.id}`)
}
</script>

<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">Admin specs</h1>
        <AdminTable :items="props.specs" :columns="[
            { key: 'id', label: 'ID', editable: false },
            { key: 'spec_type_id', label: 'Type', type: 'select', option_key: 'key', options: props.types },
            { key: 'value', label: 'Value' },
        ]" @update:item="({ rowIndex, item }) => updateSpecInline(rowIndex, item)" @create:item="createSpec"
            @delete:item="deleteSpecInline" />

    </div>
</template>