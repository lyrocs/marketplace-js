<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import { UserCircle } from 'lucide-vue-next'
import UserDto from '#dtos/user'

const props = defineProps<{
    user?: UserDto,
    unreadMessagesCount?: number
}>()
</script>

<template>
    <DropdownMenu v-if="user">
        <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="relative rounded-full">
                <UserCircle class="w-5 h-5" />
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
            <DropdownMenuItem v-if="user.isAdmin" :as="Link" href="/admin">
                Admin Panel
            </DropdownMenuItem>
            <DropdownMenuItem :as="Link" href="/deals/my">
                My deals
            </DropdownMenuItem>
            <DropdownMenuItem :as="Link" href="/chat">
                Chat &nbsp;
                <div v-if="unreadMessagesCount && unreadMessagesCount > 0" class="">
                    ({{ unreadMessagesCount > 99 ? '99+' : unreadMessagesCount }})
                </div>
            </DropdownMenuItem>
            <DropdownMenuItem :as="Link" href="/auth/logout" method="post" class="w-full"> Logout </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    <Button v-else :as="Link" href="/auth/login" class="mx-4 rounded-2xl">
        Login
    </Button>
</template>
