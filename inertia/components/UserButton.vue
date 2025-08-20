<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import { UserCircle } from 'lucide-vue-next'
import UserDto from '#dtos/user'

const props = defineProps<{
    user?: UserDto
}>()
</script>

<template>

    <DropdownMenu v-if="user">
        <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="rounded-full">
                <UserCircle class="w-5 h-5" />
                <span class="sr-only">Toggle user menu</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>{{ user?.email }}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem :as="Link" href="/settings/profile">
                Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem :as="Link" href="/settings/account">
                Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem :as="Link" href="/auth/logout" method="post" class="w-full"> Logout </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    <Button v-else :as="Link" href="/auth/login" class="mx-4 rounded-2xl">
        Login
    </Button>
</template>
