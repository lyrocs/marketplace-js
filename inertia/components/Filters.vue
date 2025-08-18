<script setup lang="ts">
import SpecDto from '#dtos/spec';
import { computed } from 'vue'

const props = defineProps<{ specs: SpecDto[], selectedIds: number[] }>()

const specsByType = computed(() => {
    return props.specs.reduce((acc, spec) => {
        if (!acc[spec.type]) {
            acc[spec.type] = []
        }
        acc[spec.type].push(spec)
        return acc
    }, {} as Record<string, SpecDto[]>)
})

const emit = defineEmits<{ (e: 'change', ids: number[]): void }>()


function handleAddSpec(id: number) {
    emit('change', [...props.selectedIds, id])
}

function handleRemoveSpec(id: number) {
    emit('change', props.selectedIds.filter((item) => item !== id))
}

function handleReset() {
    emit('change', [])
}
</script>


<template>
    <aside class="lg:col-span-1">
        <div class="space-y-8">
            <h3 class="text-xl font-bold text-gray-800">Filtres pour les annonces</h3>
            <FilterCard v-for="(specs, type) in specsByType" :key="type" :title="type">
                <SelectFilter @add="handleAddSpec" @remove="handleRemoveSpec" :specs="specs" :selectedIds="selectedIds"
                    :type="type" />
            </FilterCard>
            <button @click="handleReset"
                class="block text-center text-sm text-gray-500 hover:text-slate-600">Réinitialiser</button>
        </div>
    </aside>
</template>
