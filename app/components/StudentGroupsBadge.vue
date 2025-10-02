<template>
  <button
    v-if="count > 0"
    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
    @click="$emit('click')"
  >
    <UIcon name="i-heroicons-users" class="h-3 w-3" />
    {{ count }}
    {{ count === 1 ? "group" : "groups" }}
  </button>
  <span
    v-else
    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
  >
    <UIcon name="i-heroicons-users" class="h-3 w-3" />
    0 groups
  </span>
</template>

<script setup lang="ts">
interface Props {
  count: number;
}

defineProps<Props>();

defineEmits<{
  click: [];
}>();
</script>