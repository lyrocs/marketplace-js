<script setup lang="ts">

// You can import admin menu items or user info as props if needed
const props = defineProps<{
    user?: any
}>()

</script>

<template>
    <div class="flex min-h-screen w-full bg-muted/40">
        <!-- Sidebar -->
        <aside class="hidden md:flex md:flex-col w-64 bg-background border-r p-0 fixed inset-y-0 left-0 z-50 h-screen">
            <div class="flex items-center justify-center h-16 border-b">
                <span class="font-bold text-lg">Admin Panel</span>
            </div>
            <nav class="flex flex-col gap-2 m-4">
                <a href="/admin" class="desktop-link">Dashboard</a>
                <a href="/admin/products" class="desktop-link">Products</a>
                <a href="/admin/categories" class="desktop-link">Categories</a>
                <a href="/admin/brands" class="desktop-link">Brands</a>
                <a href="/admin/specs" class="desktop-link">Specs</a>
                <a href="/admin/users" class="desktop-link">Users</a>
            </nav>
        </aside>
        <!-- Main Content -->
        <div class="flex flex-col flex-1 min-w-0 ml-64">
            <!-- Header -->
            <header class="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-6">
                <div class="flex-1 font-semibold text-xl flex items-center h-16">Admin Dashboard</div>
                <div class="flex items-center gap-2 h-16">
                    <!-- User info, notifications, etc. -->
                    <span>{{ props.user?.name || 'Admin' }}</span>
                </div>
            </header>
            <main class="flex-1 p-6">
                <slot />
            </main>
        </div>
    </div>
</template>
