<template>
  <UCard class="mb-6">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-funnel" class="h-5 w-5 text-gray-400" />
        <h3 class="text-lg font-medium text-gray-900">Filters</h3>
        <UButton
          v-if="hasActiveFilters"
          variant="ghost"
          size="xs"
          icon="i-heroicons-x-mark"
          @click="$emit('clearFilters')"
        >
          Clear All
        </UButton>
      </div>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Student Name Filter -->
      <div>
        <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <UIcon name="i-heroicons-user" class="h-4 w-4" />
          Student Name
        </label>
        <UInput
          :model-value="filters.studentName"
          placeholder="Search by student name..."
          class="w-full"
          @update:model-value="$emit('update:filters', { ...filters, studentName: $event })"
        />
      </div>

      <!-- Question Filter -->
      <div>
        <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <UIcon name="i-heroicons-document-text" class="h-4 w-4" />
          Question
        </label>
        <UInput
          :model-value="filters.question"
          placeholder="Search by question text..."
          class="w-full"
          @update:model-value="$emit('update:filters', { ...filters, question: $event })"
        />
      </div>

      <!-- Trait Filter -->
      <div>
        <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <UIcon name="i-heroicons-tag" class="h-4 w-4" />
          Trait
        </label>
        <USelectMenu
          :model-value="filters.trait"
          :options="traitOptions"
          placeholder="Select trait..."
          class="w-full"
          @update:model-value="$emit('update:filters', { ...filters, trait: $event })"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { ResponseFilters, TraitOption } from '~/types/responses';

interface Props {
  filters: ResponseFilters;
  traitOptions: TraitOption[];
  hasActiveFilters: boolean;
}

defineProps<Props>();

defineEmits<{
  'update:filters': [filters: ResponseFilters];
  clearFilters: [];
}>();
</script>