<script setup lang="ts">
import AdminLayout from '~/layouts/AdminLayout.vue'
import ProductDto from '#dtos/product'
import SpecDto from '#dtos/spec'
defineOptions({
    layout: AdminLayout
})

const props = defineProps<{
    product: ProductDto
    specs: SpecDto[]
}>()
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'

const form = ref({
    name: props.product.name,
    status: props.product.status,
    images: Array.isArray(props.product.images) ? [...props.product.images] : [],
})
const newImage = ref('')

function addImage() {
    if (newImage.value && !form.value.images.includes(newImage.value)) {
        form.value.images.push(newImage.value)
        newImage.value = ''
    }
}

function updateProduct() {
    router.put(`/admin/product/${props.product.id}`, form.value)
}

const translations = ref(props.product.translations ? props.product.translations.map(t => ({
    ...t,
    features: t.features && typeof t.features === 'object' ? JSON.parse(JSON.stringify(t.features)) : {},
})) : [])

// For each translation, an array of keys being edited
const featureKeyEdits = ref(translations.value.map(t => Object.keys(t.features || {})))
// For each translation, a string for new feature key
const newFeatureKey = ref(translations.value.map(() => ''))

function removeTranslation(tIdx: number) {
    translations.value.splice(tIdx, 1)
    featureKeyEdits.value.splice(tIdx, 1)
    newFeatureKey.value.splice(tIdx, 1)
}

function updateFeatureKey(tIdx: number, oldKey: string, fIdx: number) {
    const editKey = featureKeyEdits.value[tIdx][fIdx]
    if (!editKey || editKey === oldKey) return
    const features = translations.value[tIdx].features
    if (features[editKey]) return // Don't overwrite existing key
    features[editKey] = features[oldKey]
    delete features[oldKey]
    // Update the key edits array
    featureKeyEdits.value[tIdx][fIdx] = editKey
}

function removeFeatureKey(tIdx: number, key: string) {
    const features = translations.value[tIdx].features
    delete features[key]
    featureKeyEdits.value[tIdx] = Object.keys(features)
}

function removeFeatureValue(tIdx: number, key: string, vIdx: number) {
    const arr = translations.value[tIdx].features[key]
    arr.splice(vIdx, 1)
}

function addFeatureValue(tIdx: number, key: string) {
    if (!translations.value[tIdx].features[key]) translations.value[tIdx].features[key] = []
    translations.value[tIdx].features[key].push('')
}

function addFeatureKey(tIdx: number) {
    const key = newFeatureKey.value[tIdx].trim()
    if (!key) return
    if (!translations.value[tIdx].features[key]) {
        translations.value[tIdx].features[key] = ['']
        featureKeyEdits.value[tIdx].push(key)
    }
    newFeatureKey.value[tIdx] = ''
}

function addTranslation() {
    translations.value.push({ language: '', name: '', description: '', features: {} })
    featureKeyEdits.value.push([])
    newFeatureKey.value.push('')
}

function updateTranslation({ rowIndex, item }: { rowIndex: number, item: any }) {
    translations.value[rowIndex] = item
    // Optionally send update to server here
}
</script>

<template>
    <div class="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 class="text-2xl font-bold mb-4">Edit Product</h1>
        <form @submit.prevent="updateProduct">
            <div class="mb-4">
                <label class="block font-semibold mb-1">Name</label>
                <input v-model="form.name" class="border px-2 py-1 rounded w-full" />
            </div>
            <div class="mb-4">
                <label class="block font-semibold mb-1">Status</label>
                <select v-model="form.status" class="border px-2 py-1 rounded w-full">
                    <option value="PENDING">Pending</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                </select>
            </div>
            <div class="mb-4">
                <label class="block font-semibold mb-1">Images</label>
                <div class="flex flex-wrap gap-2 mb-2">
                    <img v-for="(img, idx) in form.images" :key="idx" :src="img"
                        class="w-20 h-20 object-cover rounded border" />
                </div>
                <input v-model="newImage" placeholder="Add image URL..." class="border px-2 py-1 rounded w-full mb-2" />
                <button type="button" @click="addImage" class="bg-blue-500 text-white px-2 py-1 rounded">Add
                    Image</button>
            </div>
            <div class="mb-4">
                <label class="block font-semibold mb-1">Category</label>
                <div class="border px-2 py-1 rounded w-full bg-gray-50">{{ product.category?.name }}</div>
            </div>
            <div class="mb-4">
                <label class="block font-semibold mb-1">Brand</label>
                <div class="border px-2 py-1 rounded w-full bg-gray-50">{{ product.brand?.name }}</div>
            </div>
            <div class="mb-4">
                <label class="block font-semibold mb-1">Specs</label>
                <ul class="flex flex-wrap gap-2">
                    <li v-for="spec in product.specs" :key="spec.id">
                        <span class="bg-gray-200 px-2 py-1 rounded">{{ spec.type }}: {{ spec.value }}</span>
                    </li>
                </ul>
            </div>
            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Save Product</button>
        </form>

        <div class="mt-8">
            <h2 class="text-xl font-semibold mb-2">Translations</h2>
            <div v-for="(translation, tIdx) in translations" :key="tIdx" class="border rounded p-4 mb-4 bg-gray-50">
                <div class="flex gap-2 mb-2">
                    <div class="flex-1">
                        <label class="block font-semibold mb-1">Language</label>
                        <input v-model="translation.language" class="border px-2 py-1 rounded w-full" />
                    </div>
                    <button type="button" @click="removeTranslation(tIdx)" class="text-red-500 self-end">Remove</button>
                </div>
                <div class="mb-2">
                    <label class="block font-semibold mb-1">Name</label>
                    <input v-model="translation.name" class="border px-2 py-1 rounded w-full" />
                </div>
                <div class="mb-2">
                    <label class="block font-semibold mb-1">Description</label>
                    <textarea v-model="translation.description" rows="3"
                        class="border px-2 py-1 rounded w-full"></textarea>
                </div>
                <div class="mb-2">
                    <label class="block font-semibold mb-1">Features</label>
                    <div v-for="(key, fIdx) in featureKeyEdits[tIdx]" :key="key"
                        class="mb-2 border rounded p-2 bg-white">
                        <div class="flex gap-2 mb-1 items-center">
                            <input v-model="featureKeyEdits[tIdx][fIdx]" @blur="updateFeatureKey(tIdx, key, fIdx)"
                                class="border px-2 py-1 rounded flex-1" />
                            <button type="button" @click="removeFeatureKey(tIdx, key)" class="text-red-500">Remove
                                Key</button>
                        </div>
                        <div v-for="(value, vIdx) in (translation.features[key] || [])" :key="vIdx"
                            class="flex gap-2 mb-1 items-center">
                            <input v-model="translation.features[key][vIdx]" class="border px-2 py-1 rounded flex-1" />
                            <button type="button" @click="removeFeatureValue(tIdx, key, vIdx)"
                                class="text-red-500">Remove Value</button>
                        </div>
                        <button type="button" @click="addFeatureValue(tIdx, key)" class="text-blue-500">Add
                            Value</button>
                    </div>
                    <div class="flex gap-2 mt-2">
                        <input v-model="newFeatureKey[tIdx]" placeholder="New feature key..."
                            class="border px-2 py-1 rounded flex-1" />
                        <button type="button" @click="addFeatureKey(tIdx)"
                            class="bg-blue-500 text-white px-2 py-1 rounded">Add Feature Key</button>
                    </div>
                </div>
            </div>
            <button type="button" @click="addTranslation()" class="bg-blue-500 text-white px-4 py-2 rounded">Add
                Translation</button>
        </div>
    </div>
</template>