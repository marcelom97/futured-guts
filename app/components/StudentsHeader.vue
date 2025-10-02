<template>
  <div class="flex items-center justify-between mb-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
      <p class="mt-2 text-gray-600">{{ subtitle }}</p>
    </div>
    <UButton
      color="primary"
      icon="i-heroicons-plus"
      @click="$emit('addClick')"
    >
      {{ buttonText }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  subtitle: string;
  buttonText: string;
}

defineProps<Props>();
defineEmits<{
  addClick: [];
}>();
</script>