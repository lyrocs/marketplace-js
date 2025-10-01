<script setup lang="ts">
import UserDto from '#dtos/user'

interface Props {
  user?: UserDto
  unreadMessagesCount?: number
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-4">
    <SellButton :show="!!user" />
    <UserButton :user="user" :unread-messages-count="unreadMessagesCount" />
  </div>
</template>
