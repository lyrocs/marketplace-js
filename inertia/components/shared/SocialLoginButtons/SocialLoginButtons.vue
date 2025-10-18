<script setup lang="ts">
interface SocialProvider {
  name: string
  href: string
  icon: 'google' | 'facebook'
}

interface Props {
  providers: SocialProvider[]
}

defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <a
      v-for="provider in providers"
      :key="provider.name"
      :href="provider.href"
      class="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-slate-600"
    >
      <!-- Google Icon -->
      <svg v-if="provider.icon === 'google'" class="size-5" aria-hidden="true" viewBox="0 0 24 24">
        <path
          d="M12.0003 4.75C13.7703 4.75 15.2503 5.375 16.3603 6.415L19.6003 3.175C17.6003 1.45 15.0303 0.5 12.0003 0.5C7.3003 0.5 3.4203 3.325 1.8303 7.15L5.4203 9.765C6.2203 6.9 8.8203 4.75 12.0003 4.75Z"
          fill="#EA4335"
        />
        <path
          d="M23.5 12.25C23.5 11.56 23.44 10.895 23.315 10.25H12.0003V14.45H18.5203C18.2353 16.065 17.3103 17.425 15.9003 18.335L19.5803 20.945C21.9303 18.845 23.5 15.825 23.5 12.25Z"
          fill="#4285F4"
        />
        <path
          d="M5.42029 9.765C5.16529 9.075 5.01529 8.32 5.01529 7.5C5.01529 6.68 5.16529 5.925 5.42029 5.235L1.83029 1.845C0.66529 3.995 0.000294434 6.175 0.000294434 8.5C0.000294434 10.825 0.66529 13.005 1.83029 15.155L5.42029 12.545C5.16529 11.855 5.01529 11.095 5.01529 10.3C5.01529 9.505 5.16529 8.75 5.42029 9.765Z"
          fill="#FBBC05"
          transform="translate(0 -0.81)"
        />
        <path
          d="M12.0003 24C15.0303 24 17.6003 23.055 19.5803 21.36L15.9003 18.745C14.8603 19.515 13.5303 19.95 12.0003 19.95C8.8203 19.95 6.2203 17.9 5.4203 15.145L1.8303 18.545C3.4203 22.37 7.3003 24 12.0003 24Z"
          fill="#34A853"
        />
      </svg>

      <!-- Facebook Icon -->
      <svg
        v-else-if="provider.icon === 'facebook'"
        class="size-6"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.988H8.05V12h2.388V9.785c0-2.358 1.41-3.655 3.54-3.655 1.012 0 2.067.18 2.067.18v2.51h-1.229c-1.15 0-1.52.723-1.52 1.464V12h2.828l-.455 2.891h-2.373v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10Z"
        />
      </svg>

      <span>{{ provider.name }}</span>
    </a>
  </div>
</template>
