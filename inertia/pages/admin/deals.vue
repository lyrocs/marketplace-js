<script setup lang="ts">
import AdminLayout from '~/layouts/AdminLayout.vue'
import DealDto from '#dtos/deal'
import { usePage, router, useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import {
    IconCheck,
    IconClose,
    IconFolderEye,
    IconFilter
} from '@iconify-prerendered/vue-material-symbols'

defineOptions({
    layout: AdminLayout
})

const props = defineProps<{
    deals: DealDto[]
    meta: MetaDto
}>()

const page = usePage()
const queryString = page.url.split('?')[1] || ''
const searchParams = new URLSearchParams(queryString)
const currentStatus = searchParams.get('status') || 'DRAFT'

const statusOptions = [
    { value: 'DRAFT', label: 'Draft', count: 0 },
    { value: 'PUBLISHED', label: 'Published', count: 0 },
    { value: 'DECLINED', label: 'Declined', count: 0 },
    { value: 'EXPIRED', label: 'Expired', count: 0 },
    { value: 'SOLD', label: 'Sold', count: 0 },
    { value: 'ARCHIVED', label: 'Archived', count: 0 }
]

const selectedDeal = ref<DealDto | null>(null)
const showDeclineModal = ref(false)
const declineReason = ref('')

const declineForm = useForm({
    reason: ''
})

const approveForm = useForm({})

function handleStatusFilter(status: string) {
    const url = new URL(window.location.href)
    url.searchParams.set('status', status)
    url.searchParams.delete('page')
    router.get(url.toString())
}

function handleChangePage(page: number) {
    const url = new URL(window.location.href)
    url.searchParams.set('page', page.toString())
    router.get(url.toString())
}

function openDeclineModal(deal: DealDto) {
    selectedDeal.value = deal
    showDeclineModal.value = true
}

function approveDeal(deal: DealDto) {
    router.post(`/admin/deals/${deal.id}/status`, { status: 'PUBLISHED' })
}

function declineDeal() {
    if (!selectedDeal.value) return
    
    router.post(`/admin/deals/${selectedDeal.value.id}/status`, {
        status: 'DECLINED', 
        reason: declineForm.reason
    })
}

function getStatusBadgeClass(status: string) {
    const classes = {
        'DRAFT': 'bg-yellow-100 text-yellow-800',
        'PUBLISHED': 'bg-green-100 text-green-800',
        'DECLINED': 'bg-red-100 text-red-800',
        'EXPIRED': 'bg-gray-100 text-gray-800',
        'SOLD': 'bg-blue-100 text-blue-800',
        'ARCHIVED': 'bg-purple-100 text-purple-800'
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
}

function formatPrice(price: number, currency: string) {
    const symbols = { EUR: '€', USD: '$', GBP: '£' }
    return `${price} ${symbols[currency] || currency}`
}
</script>

<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold">Deal Management</h1>
            <div class="flex items-center gap-2">
                <IconFilter class="w-5 h-5" />
                <span class="text-sm text-gray-600">Filter by status</span>
            </div>
        </div>

        <!-- Status Filter -->
        <div class="flex gap-2 flex-wrap">
            <button
                v-for="option in statusOptions"
                :key="option.value"
                @click="handleStatusFilter(option.value)"
                :class="[
                    'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                    currentStatus === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
            >
                {{ option.label }}
            </button>
        </div>

        <!-- Deals Table -->
        <div class="bg-white rounded-lg shadow">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Deal
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Seller
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="deal in deals" :key="deal.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-12 w-12">
                                        <img 
                                            v-if="deal.images && deal.images.length > 0"
                                            :src="deal.images[0]" 
                                            :alt="deal.title"
                                            class="h-12 w-12 rounded-lg object-cover"
                                        />
                                        <div v-else class="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                            <span class="text-gray-400 text-xs">No image</span>
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900 line-clamp-1">
                                            {{ deal.title }}
                                        </div>
                                        <div class="text-sm text-gray-500 line-clamp-1">
                                            {{ deal.description }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">{{ deal.user?.name || 'Unknown' }}</div>
                                <div class="text-sm text-gray-500">{{ deal.location }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ formatPrice(deal.price, deal.currency) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span 
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    :class="getStatusBadgeClass(deal.status)"
                                >
                                    {{ deal.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ new Date(deal.createdAt).toLocaleDateString() }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex items-center gap-2">
                                    <a 
                                        :href="`/deals/${deal.id}`" 
                                        target="_blank"
                                        class="text-blue-600 hover:text-blue-900"
                                    >
                                        <IconFolderEye class="w-4 h-4" />
                                    </a>
                                    
                                    <button
                                        v-if="deal.status === 'DRAFT'"
                                        @click="approveDeal(deal)"
                                        :disabled="approveForm.processing"
                                        class="text-green-600 hover:text-green-900 disabled:opacity-50"
                                    >
                                        <IconCheck class="w-4 h-4" />
                                    </button>
                                    
                                    <button
                                        v-if="deal.status === 'DRAFT'"
                                        @click="openDeclineModal(deal)"
                                        class="text-red-600 hover:text-red-900"
                                    >
                                        <IconClose class="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="meta.lastPage > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div class="flex-1 flex justify-between sm:hidden">
                    <button
                        v-if="meta.currentPage > 1"
                        @click="handleChangePage(meta.currentPage - 1)"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <button
                        v-if="meta.currentPage < meta.lastPage"
                        @click="handleChangePage(meta.currentPage + 1)"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700">
                            Showing page {{ meta.currentPage }} of {{ meta.lastPage }}
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                                v-if="meta.currentPage > 1"
                                @click="handleChangePage(meta.currentPage - 1)"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                v-if="meta.currentPage < meta.lastPage"
                                @click="handleChangePage(meta.currentPage + 1)"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Decline Modal -->
    <div v-if="showDeclineModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Decline Deal</h3>
                <p class="text-sm text-gray-500 mb-4">
                    Are you sure you want to decline this deal? Please provide a reason.
                </p>
                
                <form @submit.prevent="declineDeal">
                    <div class="mb-4">
                        <label for="reason" class="block text-sm font-medium text-gray-700 mb-2">
                            Reason for declining
                        </label>
                        <textarea
                            id="reason"
                            v-model="declineForm.reason"
                            rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter reason for declining this deal..."
                            required
                        ></textarea>
                    </div>
                    
                    <div class="flex justify-end gap-3">
                        <button
                            type="button"
                            @click="showDeclineModal = false"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            :disabled="declineForm.processing"
                            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                            {{ declineForm.processing ? 'Declining...' : 'Decline Deal' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
