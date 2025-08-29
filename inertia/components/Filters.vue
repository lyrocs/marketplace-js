<script setup lang="ts">
import SpecDto from '#dtos/spec';
import CategoryDto from '#dtos/category';
import { computed, ref, watch } from 'vue'

const props = defineProps<{
    specs: SpecDto[],
    selectedIds: number[],
    categories: CategoryDto[],
    category?: number,
    inline?: boolean
}>()

const specsByType = computed(() => {
    return props.specs?.reduce((acc, spec) => {
        if (!acc[spec.type]) {
            acc[spec.type] = []
        }
        acc[spec.type].push(spec)
        return acc
    }, {} as Record<string, SpecDto[]>)
})

const emit = defineEmits<{ (e: 'change', ids: number[]): void, (e: 'change:category', id: number): void }>()

const selectedCategory = ref<number | null>(props.category || null)


function handleAddSpec(id: number) {
    emit('change', [...props.selectedIds, id])
}

function handleRemoveSpec(id: number) {
    emit('change', props.selectedIds.filter((item) => item !== id))
}

function handleReset() {
    emit('change', [])
}

function handleCategoryChange(value: number) {
    console.log('handleCategoryChange', value)
    emit('change:category', value)
}

// watch selectedCategory
watch(selectedCategory, (value) => {
    emit('change:category', value)
})
</script>


<template>
    <aside class="lg:col-span-1">
        <div class="space-y-8">
            <div :class="inline ? 'flex flex-row gap-4' : 'flex flex-col gap-4'">
                <template v-if="categories">
                    <FilterCard title="Categories">
                        <Select v-model="selectedCategory" @change="handleCategoryChange">
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem v-for="option in categories" :key="option.id" :value="option.id">
                                        {{ option.name }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </FilterCard>
                </template>
                <template v-if="specs">
                    <FilterCard v-for="(specs, type) in specsByType" :key="type" :title="type">
                        <SelectFilter @add="handleAddSpec" @remove="handleRemoveSpec" :specs="specs"
                            :selectedIds="selectedIds" :type="type" />
                    </FilterCard>
                </template>
                <div class="flex justify-center">
                    <Button @click="handleReset"
                        class="block text-center text-sm bg-gray-500 hover:bg-gray-600 w-full">Réinitialiser</Button>
                </div>
            </div>
        </div>
    </aside>
</template>
