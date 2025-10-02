<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import { IconMenuRounded, IconCloseRounded } from '@iconify-prerendered/vue-material-symbols'
import CategoryDto from '#dtos/category'
import UserDto from '#dtos/user'

interface Props {
  categories: CategoryDto[]
  user?: UserDto
  unreadMessagesCount?: number
}

const props = defineProps<Props>()

const DESKTOP_BREAKPOINT = 1024 // Tailwind lg breakpoint

// State
const mobileMenuOpen = ref(false)
const isMobile = ref(false)

// Computed
const showMobileMenu = computed(() => mobileMenuOpen.value && isMobile.value)

// Methods
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const checkScreenSize = () => {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth < DESKTOP_BREAKPOINT

  // Auto-close menu when switching to desktop
  if (wasMobile && !isMobile.value) {
    closeMobileMenu()
  }
}

// Lifecycle hooks
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  router.on('navigate', closeMobileMenu)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<template>
  <div class="flex min-h-screen w-full flex-col">
    <!-- Header -->
    <header class="fixed top-0 z-50 flex h-16 w-full items-center gap-4 border-b bg-background px-4 md:px-6">
      <!-- Logo & Desktop Menu -->
      <div class="flex items-center gap-4">
        <a href="/" class="text-2xl font-semibold"> Marketplace.js </a>
        <Menu :categories="categories" class="hidden lg:block" />
      </div>

      <!-- Right Side Actions -->
      <div class="flex flex-1 items-center justify-end gap-4">
        <!-- Mobile Menu Toggle -->
        <button class="lg:hidden" @click="toggleMobileMenu" aria-label="Toggle menu">
          <IconMenuRounded v-if="!mobileMenuOpen" class="h-6 w-6" />
          <IconCloseRounded v-else class="h-6 w-6" />
        </button>

        <!-- Desktop User Actions -->
        <div class="hidden lg:block">
          <UserActions :user="user" :unread-messages-count="unreadMessagesCount" />
        </div>
      </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <div v-if="showMobileMenu" class="fixed left-0 top-16 z-50 flex h-screen w-screen flex-col bg-background lg:hidden">
      <MenuMobile :categories="categories" />

      <!-- Mobile User Actions -->
      <div class="mb-16 flex flex-1 flex-col items-center justify-end gap-4 p-4">
        <div class="w-full border-t border-slate-200"></div>
        <UserActions :user="user" :unread-messages-count="unreadMessagesCount" />
      </div>
    </div>

    <!-- Main Content -->
    <main v-else
      class="mt-16 flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <slot />
    </main>
  </div>
</template>
