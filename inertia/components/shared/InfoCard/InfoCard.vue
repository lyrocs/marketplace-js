<script setup lang="ts">
import { IconInfoOutlineRounded } from '@iconify-prerendered/vue-material-symbols'

defineProps<{
    title: string
    description: string
}>()
</script>

<template>
    <div class="p-4 bg-secondary border border-blue-200 rounded-md">
        <div class="flex">
            <div class="flex-shrink-0">
                <IconInfoOutlineRounded class="h-5 w-5 text-secondary-foreground" />
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-medium text-secondary-foreground">
                    {{ title }}
                </h3>
                <div class="mt-2 text-sm text-secondary-foreground">
                    <p>{{ description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
