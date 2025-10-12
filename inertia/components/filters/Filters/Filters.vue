<script setup lang="ts">
import SpecDto from '#dtos/spec'
import CategoryDto from '#dtos/category'
import { computed, ref, watch } from 'vue'
import FilterCard from '~/components/filters/FilterCard/FilterCard.vue'

const props = defineProps<{
  specs: SpecDto[]
  selectedIds: number[]
  categories: CategoryDto[]
  category?: number
  statuses: string[]
  selectedStatus?: string
  inline?: boolean
}>()

const specsByType = computed(() => {
  return props.specs?.reduce(
    (acc, spec) => {
      if (!acc[spec.type.label]) {
        acc[spec.type.label] = []
      }
      acc[spec.type.label].push(spec)
      return acc
    },
    {} as Record<string, SpecDto[]>
  )
})

const emit = defineEmits<{
  (e: 'change', ids: number[]): void
  (e: 'change:category', id: number): void
  (e: 'change:status', status: string): void
}>()

const selectedCategory = ref<number | null>(props.category || null)
const selectedStatus = ref<string | null>(props.selectedStatus || null)

function handleAddSpec(id: number) {
  emit('change', [...props.selectedIds, id])
}

function handleRemoveSpec(id: number) {
  emit(
    'change',
    props.selectedIds.filter((item) => item !== id)
  )
}

function handleReset() {
  emit('change', [])
}

function handleCategoryChange(value: number) {
  emit('change:category', value)
}

function handleStatusChange(value: string) {
  emit('change:status', value)
}

// watch selectedCategory
watch(selectedCategory, (value) => {
  if (value !== null) {
    emit('change:category', value)
  }
})
</script>

<template>
  <aside class="lg:col-span-1">
    <div class="space-y-8">
      <div :class="inline ? 'flex flex-row flex-wrap gap-4' : 'flex flex-col gap-4'">
        <template v-if="statuses">
          <component :is="inline ? 'div' : FilterCard" title="Status">
            <Select v-model="selectedStatus" @update:model-value="handleStatusChange">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="option in statuses" :key="option" :value="option">
                    {{ option }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </component>
        </template>
        <template v-if="categories">
          <component :is="inline ? 'div' : FilterCard" title="Categories">
            <Select v-model="selectedCategory" @update:model-value="handleCategoryChange">
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
          </component>
        </template>
        <template v-if="specs">
          <component
            :is="inline ? 'div' : FilterCard"
            v-for="(specs, type) in specsByType"
            :key="type"
            :title="type"
          >
            <SelectFilter
              @add="handleAddSpec"
              @remove="handleRemoveSpec"
              :specs="specs"
              :selectedIds="selectedIds"
              :type="type"
              :inline="inline"
            />
          </component>
        </template>
        <div class="flex justify-center items-center">
          <Button
            @click="handleReset"
            class="block text-center text-sm bg-gray-500 hover:bg-gray-600 w-full"
            >Réinitialiser</Button
          >
        </div>
      </div>
    </div>
  </aside>
</template>
