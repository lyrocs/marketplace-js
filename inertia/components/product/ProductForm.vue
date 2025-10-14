<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PropType } from 'vue'
import SpecDto from '#dtos/spec'
import CategoryDto from '#dtos/category'
import BrandDto from '#dtos/brand'
import ProductStatus from '#enums/product_status'
import {
  IconCloudDoneOutline
} from '@iconify-prerendered/vue-material-symbols'

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
  messages: {
    type: Object as PropType<any>,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  s3BaseUrl: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'submit', 'upload-image', 'publish'])

const showImagePopin = ref(false)
const selectedImageUrl = ref('')

function openImagePopin(imageUrl: string) {
  selectedImageUrl.value = imageUrl
  showImagePopin.value = true
}

function closeImagePopin() {
  showImagePopin.value = false
  selectedImageUrl.value = ''
}

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

const newFeatureTitle = ref('')

function removeFeatureItem(fIdx: number, itemIdx: number) {
  localForm.value.features[fIdx].items.splice(itemIdx, 1)
}

function addFeatureItem(fIdx: number) {
  localForm.value.features[fIdx].items.push('')
}

function addFeature() {
  const title = newFeatureTitle.value.trim()
  if (!title) return
  localForm.value.features.push({ title, items: [''] })
  newFeatureTitle.value = ''
}

function removeFeature(fIdx: number) {
  localForm.value.features.splice(fIdx, 1)
}

function uploadImage() {
  emit('upload-image')
}
function publish() {
  emit('publish')
}

const hasExternalImages = computed(() => {
  return localForm.value.images.some((img: string) => !img.includes(props.s3BaseUrl))
})


</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="mb-4">
      <label class="block font-semibold mb-1">Name</label>
      <input v-model="localForm.name" @input="updateField('name', localForm.name)"
        class="border px-2 py-1 rounded w-full" />
    </div>
    <div class="mb-4">
      <label class="block font-semibold mb-1">Status</label>
      <select v-model="localForm.status" @change="updateField('status', localForm.status)"
        class="border px-2 py-1 rounded w-full">
        <option v-for="status in ProductStatus" :key="status" :value="status">{{ status }}</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block font-semibold mb-1">Images</label>
      <div class="flex flex-wrap gap-2 mb-2">
        <div v-for="(img, idx) in localForm.images" :key="idx" class="relative group cursor-pointer"
          @click="openImagePopin(img)">
          <img :src="img" class="w-20 h-20 object-cover rounded border" />
          <IconCloudDoneOutline v-if="img.includes(s3BaseUrl)"
            class="absolute -top-1 -left-1 text-green-600 p-1 text-3xl" />
          <button type="button" @click.stop="removeImage(idx)"
            class="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100 group-hover:opacity-100">&times;</button>
        </div>
      </div>
      <input v-model="newImage" placeholder="Add image URL..." class="border px-2 py-1 rounded w-full mb-2" />
      <button type="button" @click="addImage" class="bg-blue-500 text-white px-2 py-1 rounded">Add Image</button>

      <div v-if="showImagePopin" @click="closeImagePopin"
        class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div class="relative max-w-4xl max-h-full p-4">
          <img :src="selectedImageUrl" class="max-w-full max-h-full object-contain" @click.stop />
          <button @click="closeImagePopin" class="absolute top-4 right-4 text-white text-3xl font-bold">&times;</button>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <label class="block font-semibold mb-1">Category</label>
      <select v-model="localForm.category_id" @change="updateField('category_id', localForm.category_id)"
        class="border px-2 py-1 rounded w-full">
        <option value="">Select category</option>
        <option v-for="cat in props.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block font-semibold mb-1">Brand</label>
      <select v-model="localForm.brand_id" @change="updateField('brand_id', localForm.brand_id)"
        class="border px-2 py-1 rounded w-full">
        <option value="">Select brand</option>
        <option v-for="brand in props.brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block font-semibold mb-1">Specs</label>
      <ul class="flex flex-wrap gap-2 mb-2">
        <li v-for="id in localForm.specs" :key="id" class="flex items-center gap-2">
          <span class="bg-gray-200 px-2 py-1 rounded">
            {{props.specs.find(s => s.id === id)?.type.label}}: {{props.specs.find(s => s.id === id)?.value}}
          </span>
          <button type="button" @click="removeSpec(id)" class="text-red-500">Remove</button>
        </li>
      </ul>
      <div class="flex gap-2">
        <select v-model="selectedSpecId" @change="addSpec" class="border px-2 py-1 rounded flex-1">
          <option value="">Select spec to add</option>
          <option v-for="spec in props.specs" :key="spec.id" :value="spec.id"
            :disabled="localForm.specs.includes(spec.id)">
            {{ spec.type.label }}: {{ spec.value }}
          </option>
        </select>
        <button type="button" @click="addSpec" class="bg-blue-500 text-white px-2 py-1 rounded">Add Spec</button>
      </div>
    </div>
    <div class="mb-2">
      <label class="block font-semibold mb-1">Description</label>
      <textarea v-model="localForm.description" @input="updateField('description', localForm.description)" rows="8"
        class="border px-2 py-1 rounded w-full"></textarea>
    </div>
    <div class="mb-2">
      <label class="block font-semibold mb-1">Features</label>
      <div v-for="(feature, fIdx) in localForm.features" :key="fIdx" class="mb-2 border rounded p-2 bg-white">
        <div class="flex gap-2 mb-1 items-center">
          <input v-model="feature.title" class="border px-2 py-1 rounded flex-1" placeholder="Feature Title" />
          <button type="button" @click="removeFeature(fIdx)" class="text-red-500">Remove
            Feature</button>
        </div>
        <div v-for="(item, itemIdx) in feature.items" :key="itemIdx" class="flex gap-2 mb-1 items-center">
          <input v-model="feature.items[itemIdx]" class="border px-2 py-1 rounded flex-1" placeholder="Item" />
          <button type="button" @click="removeFeatureItem(fIdx, itemIdx)" class="text-red-500">Remove
            Item</button>
        </div>
        <button type="button" @click="addFeatureItem(fIdx)" class="text-blue-500">Add
          Item</button>
      </div>
      <div class="flex gap-2 mt-2">
        <input v-model="newFeatureTitle" placeholder="New feature title..." class="border px-2 py-1 rounded flex-1" />
        <button type="button" @click="addFeature()" class="bg-blue-500 text-white px-4 py-2 rounded">Add
          Feature</button>
      </div>
    </div>
    <div class="flex gap-2 mt-2">
      <button v-if="hasExternalImages" type="button" @click="uploadImage()"
        class="bg-blue-500 text-white px-4 py-2 rounded mt-4">Upload
        Image</button>

      <button v-if="localForm.status === ProductStatus.IMPORTED" type="button" @click="publish()"
        class="bg-blue-500 text-white px-4 py-2 rounded mt-4">Publish</button>

      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded mt-4">{{ props.isEdit ? 'Save Product' :
        'Create Product' }}</button>
    </div>
  </form>
</template>
