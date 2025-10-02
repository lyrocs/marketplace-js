<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  logoHref?: string
}

withDefaults(defineProps<Props>(), {
  logoHref: '/',
})
</script>

<template>
  <div class="auth-header">
    <a :href="logoHref" class="auth-logo">
      Marketplace<span class="auth-logo-accent">.js</span>
    </a>
    <h2 class="auth-title">{{ title }}</h2>
    <p class="auth-subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.auth-header {
  @apply sm:mx-auto sm:w-full sm:max-w-md;
}

.auth-logo {
  @apply block text-center text-3xl font-bold text-gray-800;
}

.auth-logo-accent {
  @apply text-slate-600;
}

.auth-title {
  @apply mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900;
}

.auth-subtitle {
  @apply mt-1 text-center text-gray-600;
}
</style>
