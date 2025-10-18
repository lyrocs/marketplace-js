<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'
import { IconSearch } from '@iconify-prerendered/vue-material-symbols'

interface Props {
  title: string
  description: string
  backgroundImage: string
  searchPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: 'Que recherchez-vous ?',
})

const searchInput = ref('')

const search = () => {
  if (searchInput.value.trim()) {
    router.get(`/products/search/${searchInput.value}`)
  }
}
</script>

<template>
  <section class="relative flex h-[60vh] min-h-[400px] items-center">
    <div
      class="absolute inset-0 size-full bg-cover bg-center"
      :style="{ backgroundImage: `url('${backgroundImage}')` }"
    />
    <div class="absolute inset-0 size-full bg-slate-900/60" />
    <div class="container relative mx-auto px-4 text-center text-white">
      <h1 class="text-4xl font-extrabold tracking-tight md:text-6xl">{{ title }}</h1>
      <p class="mx-auto mt-4 max-w-3xl text-lg text-slate-200 md:text-xl">{{ description }}</p>
      <div class="mx-auto mt-8 flex max-w-xl items-center justify-center">
        <div class="relative w-full max-w-sm">
          <Input
            v-model="searchInput"
            @keyup.enter="search"
            type="text"
            :placeholder="searchPlaceholder"
            class="pl-10 text-black"
          />
          <span class="absolute inset-y-0 start-0 flex items-center justify-center px-2">
            <IconSearch class="size-6 text-muted-foreground" />
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
