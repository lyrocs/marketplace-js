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
    specs: props.product.specs ? props.product.specs.map(s => s.id) : [],
})

const selectedSpecId = ref('')

function addSpec() {
    const id = Number(selectedSpecId.value)
    if (id && !form.value.specs.includes(id)) {
        form.value.specs.push(id)
        selectedSpecId.value = ''
    }
}

function removeSpec(id: number) {
    form.value.specs = form.value.specs.filter(sid => sid !== id)
}

const newImage = ref('')

function addImage() {
    if (newImage.value && !form.value.images.includes(newImage.value)) {
        form.value.images.push(newImage.value)
        newImage.value = ''
    }
}

function removeImage(idx: number) {
    form.value.images.splice(idx, 1)
}

function updateProduct() {
    router.put(`/admin/product/${props.product.id}`, { ...form.value, translations: translations.value })
    messages.value.success = 'Product updated successfully'
}

const translations = ref(props.product.translations ? props.product.translations.map(t => ({
    ...t,
    features: Array.isArray(t.features) ? JSON.parse(JSON.stringify(t.features)) : [],
})) : [])

// For each translation, a string for new feature title
const newFeatureTitle = ref(translations.value.map(() => ''))

const messages = ref({
    success: '',
    errorsBag: {},
})

function removeTranslation(tIdx: number) {
    translations.value.splice(tIdx, 1)
    featureKeyEdits.value.splice(tIdx, 1)
    newFeatureKey.value.splice(tIdx, 1)
}

// No longer needed: updateFeatureKey

// No longer needed: removeFeatureKey

function removeFeatureItem(tIdx: number, fIdx: number, itemIdx: number) {
    translations.value[tIdx].features[fIdx].items.splice(itemIdx, 1)
}

function addFeatureItem(tIdx: number, fIdx: number) {
    translations.value[tIdx].features[fIdx].items.push('')
}

function addFeature(tIdx: number) {
    const title = newFeatureTitle.value[tIdx].trim()
    if (!title) return
    translations.value[tIdx].features.push({ title, items: [''] })
    newFeatureTitle.value[tIdx] = ''
}

function removeFeature(tIdx: number, fIdx: number) {
    translations.value[tIdx].features.splice(fIdx, 1)
}

function addTranslation() {
    translations.value.push({ language: '', name: '', description: '', features: [] })
    newFeatureTitle.value.push('')
}

function updateTranslation({ rowIndex, item }: { rowIndex: number, item: any }) {
    translations.value[rowIndex] = item
    // Optionally send update to server here
}
</script>

<template>
    <div class=" mx-auto bg-white p-6 rounded shadow">
        <h1 class="text-2xl font-bold mb-6">Edit Product</h1>
        <ToastManager :messages="messages" />
        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Left column: Global info -->
            <div class="flex-1 min-w-0">
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
                            <div v-for="(img, idx) in form.images" :key="idx" class="relative group">
                                <Dialog>
                                    <DialogTrigger>
                                        <img :src="img" class="w-20 h-20 object-cover rounded border" />
                                        <button type="button" @click="removeImage(idx)"
                                            class="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100 group-hover:opacity-100">
                                            &times;
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <img :src="img" class="w-full h-full object-cover rounded border" />
                                    </DialogContent>
                                </Dialog>


                            </div>
                        </div>
                        <input v-model="newImage" placeholder="Add image URL..."
                            class="border px-2 py-1 rounded w-full mb-2" />
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
                        <ul class="flex flex-wrap gap-2 mb-2">
                            <li v-for="id in form.specs" :key="id" class="flex items-center gap-2">
                                <span class="bg-gray-200 px-2 py-1 rounded">
                                    {{props.specs.find(s => s.id === id)?.type}}: {{props.specs.find(s => s.id ===
                                        id)?.value}}
                                </span>
                                <button type="button" @click="removeSpec(id)" class="text-red-500">Remove</button>
                            </li>
                        </ul>
                        <div class="flex gap-2">
                            <select v-model="selectedSpecId" class="border px-2 py-1 rounded flex-1">
                                <option value="">Select spec to add</option>
                                <option v-for="spec in props.specs" :key="spec.id" :value="spec.id"
                                    :disabled="form.specs.includes(spec.id)">
                                    {{ spec.type }}: {{ spec.value }}
                                </option>
                            </select>
                            <button type="button" @click="addSpec" class="bg-blue-500 text-white px-2 py-1 rounded">Add
                                Spec</button>
                        </div>
                    </div>
                    <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded mt-4">Save Product</button>
                </form>
            </div>
            <!-- Right column: Translations -->
            <div class="flex-1 min-w-0">
                <h2 class="text-xl font-semibold mb-2">Translations</h2>
                <div v-for="(translation, tIdx) in translations" :key="tIdx" class="border rounded p-4 mb-4 bg-gray-50">
                    <div class="flex gap-2 mb-2">
                        <div class="flex-1">
                            <label class="block font-semibold mb-1">Language</label>
                            <input v-model="translation.language" class="border px-2 py-1 rounded w-full" />
                        </div>
                        <button type="button" @click="removeTranslation(tIdx)"
                            class="text-red-500 self-end">Remove</button>
                    </div>
                    <div class="mb-2">
                        <label class="block font-semibold mb-1">Name</label>
                        <input v-model="translation.name" class="border px-2 py-1 rounded w-full" />
                    </div>
                    <div class="mb-2">
                        <label class="block font-semibold mb-1">Description</label>
                        <textarea v-model="translation.description" rows="8"
                            class="border px-2 py-1 rounded w-full"></textarea>
                    </div>
                    <div class="mb-2">
                        <label class="block font-semibold mb-1">Features</label>
                        <div v-for="(feature, fIdx) in translation.features" :key="fIdx" class="mb-2 border rounded p-2 bg-white">
    <div class="flex gap-2 mb-1 items-center">
        <input v-model="feature.title" class="border px-2 py-1 rounded flex-1" placeholder="Feature Title" />
        <button type="button" @click="removeFeature(tIdx, fIdx)" class="text-red-500">Remove Feature</button>
    </div>
    <div v-for="(item, itemIdx) in feature.items" :key="itemIdx" class="flex gap-2 mb-1 items-center">
        <input v-model="feature.items[itemIdx]" class="border px-2 py-1 rounded flex-1" placeholder="Item" />
        <button type="button" @click="removeFeatureItem(tIdx, fIdx, itemIdx)" class="text-red-500">Remove Item</button>
    </div>
    <button type="button" @click="addFeatureItem(tIdx, fIdx)" class="text-blue-500">Add Item</button>
</div>
<div class="flex gap-2 mt-2">
    <input v-model="newFeatureTitle[tIdx]" placeholder="New feature title..." class="border px-2 py-1 rounded flex-1" />
    <button type="button" @click="addFeature(tIdx)" class="bg-blue-500 text-white px-2 py-1 rounded">Add Feature</button>
</div>
                    </div>
                </div>
                <button type="button" @click="addTranslation()" class="bg-blue-500 text-white px-4 py-2 rounded">Add
                    Translation</button>
            </div>
        </div>
    </div>
</template>