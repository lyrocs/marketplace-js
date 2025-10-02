<script setup lang="ts">
import CategoryDto from "#dtos/category";
import { useMenu } from "~/composables/useMenu";

const props = defineProps<{
  categories: CategoryDto[]
}>()

const { menuParentCategories } = useMenu({ categories: props.categories })

</script>

<template>
  <div>
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem v-for="parentCategory in menuParentCategories" :key="parentCategory.title">
          <NavigationMenuTrigger>{{ parentCategory.title }}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
              <li v-for="childCategory in parentCategory.children" :key="childCategory.title">
                <NavigationMenuLink as-child>
                  <a :href="childCategory.href">
                    <div class="flex items-center gap-2">
                      <img :src="childCategory.image" class="h-6 w-6">
                      <span>{{ childCategory.title }}</span>
                    </div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {{ childCategory.description }}
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>
</template>