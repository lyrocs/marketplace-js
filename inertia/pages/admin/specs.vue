<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import AdminLayout from '~/layouts/AdminLayout.vue'
import SpecDto from '#dtos/spec'
defineOptions({ layout: AdminLayout })

const props = defineProps<{ specs: SpecDto[] }>()

function createSpec({ type, value }: { type: string, value: string }) {
    router.post('/admin/specs', { type, value })
}

function updateSpecInline(rowIndex: number, item: SpecDto) {
    router.put(`/admin/specs/${item.id}`, { type: item.type, value: item.value })
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
            { key: 'type', label: 'Type' },
            { key: 'value', label: 'Value' },
        ]" @update:item="({ rowIndex, item }) => updateSpecInline(rowIndex, item)" @create:item="createSpec"
            @delete:item="deleteSpecInline" />

    </div>
</template>