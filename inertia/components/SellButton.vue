<script setup lang="ts">
interface Props {
  show?: boolean
}

withDefaults(defineProps<Props>(), {
  show: true,
})
</script>

<template>
  <a
    v-if="show"
    href="/deals/create"
    class="rounded-full bg-slate-700 px-5 py-2 font-semibold text-white transition-colors hover:bg-slate-800"
  >
    Vendre
  </a>
</template>
