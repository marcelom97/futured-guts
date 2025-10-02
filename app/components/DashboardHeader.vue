<template>
  <div class="mb-8">
    <h1 class="text-4xl font-bold text-gray-900">{{ title }}</h1>
    <p class="mt-2 text-lg text-gray-600">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  subtitle: string;
}

defineProps<Props>();
</script>