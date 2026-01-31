<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import UserDto from '#dtos/user'
import { computed } from 'vue'

const props = defineProps<{
    user?: UserDto,
    unreadMessagesCount?: number,
    inline?: boolean
}>()

const avatarUrl = computed(() => {
  return props.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(props.user?.name || 'User')}&background=6366f1&color=fff&size=128`
})
</script>

<template>
    <!-- Mode inline pour mobile : accordéon comme MenuMobile -->
    <Accordion v-if="user && inline" type="single" collapsible class="w-full">
        <AccordionItem value="user-menu">
            <AccordionTrigger class="px-12 py-6">
                Mon compte
                <span v-if="unreadMessagesCount && unreadMessagesCount > 0" class="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {{ unreadMessagesCount > 99 ? '99+' : unreadMessagesCount }}
                </span>
            </AccordionTrigger>
            <AccordionContent>
                <ul class="flex flex-col gap-2 px-12">
                    <li>
                        <Link href="/deals/create" class="block py-2 hover:font-bold">
                            Vendre
                        </Link>
                    </li>
                    <li>
                        <Link href="/deals/my" class="block py-2 hover:font-bold">
                            Mes annonces
                        </Link>
                    </li>
                    <li>
                        <Link href="/profile" class="block py-2 hover:font-bold">
                            Mon Profil
                        </Link>
                    </li>
                    <li v-if="user.isAdmin">
                        <Link href="/admin" class="block py-2 hover:font-bold">
                            Admin Panel
                        </Link>
                    </li>
                    <li>
                        <Link href="/chat" class="block py-2 hover:font-bold">
                            Chat
                            <span v-if="unreadMessagesCount && unreadMessagesCount > 0" class="ml-1 text-red-500 font-semibold">
                                ({{ unreadMessagesCount > 99 ? '99+' : unreadMessagesCount }})
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/auth/logout" method="post" class="block py-2 hover:font-bold text-destructive">
                            Déconnexion
                        </Link>
                    </li>
                </ul>
            </AccordionContent>
        </AccordionItem>
    </Accordion>

    <!-- Mode dropdown pour desktop -->
    <DropdownMenu v-else-if="user">
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
            <DropdownMenuItem :as="Link" href="/deals/create">
                Vendre
            </DropdownMenuItem>
            <DropdownMenuItem :as="Link" href="/deals/my">
                Mes annonces
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem :as="Link" href="/profile">
                Mon Profil
            </DropdownMenuItem>
            <DropdownMenuItem v-if="user.isAdmin" :as="Link" href="/admin">
                Admin Panel
            </DropdownMenuItem>
            <DropdownMenuItem :as="Link" href="/chat">
                Chat &nbsp;
                <div v-if="unreadMessagesCount && unreadMessagesCount > 0" class="">
                    ({{ unreadMessagesCount > 99 ? '99+' : unreadMessagesCount }})
                </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem :as="Link" href="/auth/logout" method="post" class="w-full"> Déconnexion </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

    <Button v-else :as="Link" href="/auth/login" class="mx-4 rounded-2xl">
        Login
    </Button>
</template>
