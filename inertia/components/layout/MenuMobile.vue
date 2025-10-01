<script setup lang="ts">
import { useMenu } from '~/composables/useMenu'
import CategoryDto from '#dtos/category'

const props = defineProps<{
    categories: CategoryDto[]
}>()

const { menuParentCategories } = useMenu({ categories: props.categories })

</script>

<template>
    <Accordion type="single" collapsible>
        <AccordionItem v-for="parentCategory in menuParentCategories" :key="parentCategory.title"
            :value="parentCategory.title">
            <AccordionTrigger class="px-12 py-6">{{ parentCategory.title }}</AccordionTrigger>
            <AccordionContent>
                <ul class="grid grid-cols-2 gap-2 px-12">
                    <li v-for="childCategory in parentCategory.children" :key="childCategory.title">
                        <a :href="childCategory.href" class="">
                            <div class="flex items-center gap-2 hover:font-bold">
                                <img :src="childCategory.image" class="h-6 w-6">
                                <span>{{ childCategory.title }}</span>
                            </div>
                            <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {{ childCategory.description }}
                            </p>
                        </a>
                    </li>
                </ul>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
</template>