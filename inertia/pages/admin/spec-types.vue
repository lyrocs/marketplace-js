<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import AdminLayout from '~/layouts/AdminLayout.vue'
import SpecTypeDto from '#dtos/spec_type'
defineOptions({ layout: AdminLayout })

const props = defineProps<{ types: SpecTypeDto[] }>()

function createSpec({ key, label, description }: { key: string, label: string, description: string }) {
    router.post('/admin/spec-types', { key, label, description })
}

function updateSpecInline(rowIndex: number, item: SpecTypeDto) {
    router.put(`/admin/spec-types/${item.id}`, { key: item.key, label: item.label, description: item.description })
}
function deleteSpecInline(item: SpecTypeDto) {
    router.delete(`/admin/spec-types/${item.id}`)
}
</script>

<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">Admin spec types</h1>
        <AdminTable :items="props.types" :columns="[
            { key: 'id', label: 'ID', editable: false },
            { key: 'key', label: 'Key' },
            { key: 'label', label: 'Label' },
            { key: 'description', label: 'Description' },
        ]" @update:item="({ rowIndex, item }) => updateSpecInline(rowIndex, item)" @create:item="createSpec"
            @delete:item="deleteSpecInline" />

    </div>
</template>