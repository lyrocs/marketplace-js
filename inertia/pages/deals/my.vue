<script setup lang="ts">
import DealDto from '#dtos/deal'

const props = defineProps<{
    deals: DealDto[]
}>()
</script>

<template>
    <div>
        <h1>My Deals</h1>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="deal in deals" :key="deal.id">
                <MyDealCard :deal="deal" />
            </div>
        </div>
    </div>
</template>
