<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PropType } from 'vue'
import ProductDto from '#dtos/product'
import SpecDto from '#dtos/spec'
import CategoryDto from '#dtos/category'
import BrandDto from '#dtos/brand'

const props = defineProps({
  modelValue: {
    type: Object as PropType<any>, // Accepts product form object
    required: true,
  },
  specs: {
    type: Array as PropType<SpecDto[]>,
    required: true,
  },
  categories: {
    type: Array as PropType<CategoryDto[]>,
    required: true,
  },
  brands: {
    type: Array as PropType<BrandDto[]>,
    required: true,
  },
  translations: {
    type: Array as PropType<any[]>,
    required: true,
  },
  messages: {
    type: Object as PropType<any>,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const localForm = ref({ ...props.modelValue })

function updateField(field: string, value: any) {
  localForm.value[field] = value
  emit('update:modelValue', { ...localForm.value })
}

function onSubmit() {
  emit('submit')
}

const selectedSpecId = ref('')
function addSpec() {
  const id = Number(selectedSpecId.value)
  if (id && !localForm.value.specs.includes(id)) {
    localForm.value.specs.push(id)
    emit('update:modelValue', { ...localForm.value })
    selectedSpecId.value = ''
  }
}
function removeSpec(id: number) {
  localForm.value.specs = localForm.value.specs.filter((sid: number) => sid !== id)
  emit('update:modelValue', { ...localForm.value })
}
const newImage = ref('')
function addImage() {
  if (newImage.value && !localForm.value.images.includes(newImage.value)) {
    localForm.value.images.push(newImage.value)
    emit('update:modelValue', { ...localForm.value })
    newImage.value = ''
  }
}
function removeImage(idx: number) {
  localForm.value.images.splice(idx, 1)
  emit('update:modelValue', { ...localForm.value })
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="mb-4">
      <label class="block font-semibold mb-1">Name</label>
      <input v-model="localForm.name" @input="updateField('name', localForm.name)" class="border px-2 py-1 rounded w-full" />
    </div>
    <div class="mb-4">
      <label class="block font-semibold mb-1">Status</label>
      <select v-model="localForm.status" @change="updateField('status', localForm.status)" class="border px-2 py-1 rounded w-full">
        <option value="PENDING">Pending</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block font-semibold mb-1">Images</label>
      <div class="flex flex-wrap gap-2 mb-2">
        <div v-for="(img, idx) in localForm.images" :key="idx" class="relative group">
          <img :src="img" class="w-20 h-20 object-cover rounded border" />
          <button type="button" @click="removeImage(idx)" class="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100 group-hover:opacity-100">&times;</button>
        </div>
      </div>
      <input v-model="newImage" placeholder="Add image URL..." class="border px-2 py-1 rounded w-full mb-2" />
      <button type="button" @click="addImage" class="bg-blue-500 text-white px-2 py-1 rounded">Add Image</button>
    </div>
    <div class="mb-4">
      <label class="block font-semibold mb-1">Category</label>
      <select v-model="localForm.category_id" @change="updateField('category_id', localForm.category_id)" class="border px-2 py-1 rounded w-full">
        <option value="">Select category</option>
        <option v-for="cat in props.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block font-semibold mb-1">Brand</label>
      <select v-model="localForm.brand_id" @change="updateField('brand_id', localForm.brand_id)" class="border px-2 py-1 rounded w-full">
        <option value="">Select brand</option>
        <option v-for="brand in props.brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block font-semibold mb-1">Specs</label>
      <ul class="flex flex-wrap gap-2 mb-2">
        <li v-for="id in localForm.specs" :key="id" class="flex items-center gap-2">
          <span class="bg-gray-200 px-2 py-1 rounded">
            {{props.specs.find(s => s.id === id)?.type}}: {{props.specs.find(s => s.id === id)?.value}}
          </span>
          <button type="button" @click="removeSpec(id)" class="text-red-500">Remove</button>
        </li>
      </ul>
      <div class="flex gap-2">
        <select v-model="selectedSpecId" class="border px-2 py-1 rounded flex-1">
          <option value="">Select spec to add</option>
          <option v-for="spec in props.specs" :key="spec.id" :value="spec.id" :disabled="localForm.specs.includes(spec.id)">
            {{ spec.type }}: {{ spec.value }}
          </option>
        </select>
        <button type="button" @click="addSpec" class="bg-blue-500 text-white px-2 py-1 rounded">Add Spec</button>
      </div>
    </div>
    <slot name="translations"></slot>
    <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded mt-4">{{ props.isEdit ? 'Save Product' : 'Create Product' }}</button>
  </form>
</template>
