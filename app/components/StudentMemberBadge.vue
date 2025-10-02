<template>
  <span
    class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
  >
    <UIcon name="i-heroicons-user" class="h-3 w-3" />
    {{ member.name }}
  </span>
</template>

<script setup lang="ts">
import type { GroupMember } from '~/types/students';

interface Props {
  member: GroupMember;
}

defineProps<Props>();
</script>