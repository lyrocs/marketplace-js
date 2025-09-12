<script setup lang="ts">

import CategoryDto from '#dtos/category'
import UserDto from "#dtos/user";

const props = defineProps<{
  categories: CategoryDto[]
  user?: UserDto
}>()

</script>

<template>
  <div class="flex min-h-screen w-full flex-col">
    <header class="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Menu :categories="categories" />
      <!-- User Panel -->
      <div class="flex flex-1 items-center justify-end gap-4">
        <a v-if="user" href="/deals/create"
          class="bg-slate-700 text-white font-semibold py-2 px-5 rounded-full hover:bg-slate-800 transition-colors">Vendre</a>
        <UserButton :user="user" />
      </div>
    </header>

    <main class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <slot />
    </main>
  </div>
</template>
