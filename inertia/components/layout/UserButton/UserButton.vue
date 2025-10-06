<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import UserDto from '#dtos/user'
import { computed } from 'vue'

const props = defineProps<{
    user?: UserDto,
    unreadMessagesCount?: number
}>()

const avatarUrl = computed(() => {
  return props.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(props.user?.name || 'User')}&background=6366f1&color=fff&size=128`
})
</script>

<template>
    <DropdownMenu v-if="user">
        <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="relative rounded-full">
                <img :src="avatarUrl" :alt="user?.name || 'User'" class="w-8 h-8 rounded-full" />
                <div v-if="unreadMessagesCount && unreadMessagesCount > 0"
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]">
                    {{ unreadMessagesCount > 99 ? '99+' : unreadMessagesCount }}
                </div>
                <span class="sr-only">Toggle user menu</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>{{ user?.email }}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem :as="Link" href="/profile">
                Mon Profil
            </DropdownMenuItem>
            <DropdownMenuItem v-if="user.isAdmin" :as="Link" href="/admin">
                Admin Panel
            </DropdownMenuItem>
            <DropdownMenuItem :as="Link" href="/deals/my">
                Mes annonces
            </DropdownMenuItem>
            <DropdownMenuItem :as="Link" href="/chat">
                Chat &nbsp;
                <div v-if="unreadMessagesCount && unreadMessagesCount > 0" class="">
                    ({{ unreadMessagesCount > 99 ? '99+' : unreadMessagesCount }})
                </div>
            </DropdownMenuItem>
            <DropdownMenuItem :as="Link" href="/auth/logout" method="post" class="w-full"> Déconnexion </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    <Button v-else :as="Link" href="/auth/login" class="mx-4 rounded-2xl">
        Login
    </Button>
</template>
