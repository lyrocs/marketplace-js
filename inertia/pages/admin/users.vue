<script setup lang="ts">
import AdminLayout from '~/layouts/AdminLayout.vue'

defineOptions({
    layout: AdminLayout
})

const props = defineProps<{ users: UserDto[] }>()

</script>

<template>
    <div>
        <h1>Admin Users</h1>
        <AdminTable :items="props.users" :columns="[
            { key: 'id', label: 'ID', editable: false },
            { key: 'name', label: 'Name', editable: false },
            { key: 'email', label: 'Email', editable: false },
        ]" :can-create="false" />
    </div>
</template>