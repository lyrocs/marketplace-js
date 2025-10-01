<script setup lang="ts">

import CategoryDto from '#dtos/category'
import UserDto from "#dtos/user";
import { ref, onMounted, onUnmounted } from 'vue';
import { router } from '@inertiajs/vue3'
import { IconMenuRounded, IconCloseRounded } from '@iconify-prerendered/vue-material-symbols'

const props = defineProps<{
  categories: CategoryDto[]
  user?: UserDto,
  unreadMessagesCount?: number
}>()


const mobileMenuOpen = ref(false)
const isMobile = ref(false)

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024 // lg breakpoint
  if (!isMobile.value) {
    mobileMenuOpen.value = false
  }
}

const closeMenu = () => {
  mobileMenuOpen.value = false
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  router.on('navigate', closeMenu)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  router.off('navigate', closeMenu)
})

</script>

<template>
  <div class="flex min-h-screen w-full flex-col">
    <header class="fixed w-full top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div class="flex gap-4 items-center">
        <a href="/" class="text-2xl font-semibold">
          Marketplace.js
        </a>
        <Menu :categories="categories" class="hidden lg:block" />
      </div>
      <!-- User Panel -->

      <div class="flex flex-1 items-center justify-end gap-4">
        <button class="lg:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
          <IconMenuRounded v-if="!mobileMenuOpen" class="w-6 h-6" />
          <IconCloseRounded v-else class="w-6 h-6" />
        </button>
        <div class="hidden lg:block">
          <a v-if="user" href="/deals/create"
            class="bg-slate-700 text-white font-semibold py-2 px-5 rounded-full hover:bg-slate-800 transition-colors">Vendre</a>
          <UserButton :user="user" :unreadMessagesCount="unreadMessagesCount" />
        </div>
      </div>
    </header>

    <div v-if="mobileMenuOpen && isMobile"
      class="lg:hidden fixed top-16 left-0 z-50 h-screen w-screen bg-background flex flex-col">
      <MenuMobile :categories="categories" />
      <div class="flex-1 flex flex-col items-center justify-end gap-4 mb-16 p-4">
        <div class="border-t border-slate-200 w-full"></div>
        <div class="flex items-center gap-4">
          <a v-if="user" href="/deals/create"
            class="bg-slate-700 text-white font-semibold py-2 px-5 rounded-full hover:bg-slate-800 transition-colors">Vendre</a>
          <UserButton :user="user" :unreadMessagesCount="unreadMessagesCount" />
        </div>
      </div>
    </div>

    <main v-else
      class="flex mt-16 min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <slot />
    </main>
  </div>
</template>
