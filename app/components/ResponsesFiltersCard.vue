<template>
  <div class="mb-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Student Name Filter -->
      <div>
        <label
          class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
        >
          <UIcon name="i-heroicons-user" class="h-4 w-4" />
          Student Name
        </label>
        <UInput
          :model-value="filters.studentName"
          placeholder="Search by student name..."
          class="w-full"
          @update:model-value="
            $emit('update:filters', { ...filters, studentName: $event })
          "
        />
      </div>

      <!-- Question Filter -->
      <div>
        <label
          class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
        >
          <UIcon name="i-heroicons-document-text" class="h-4 w-4" />
          Question
        </label>
        <UInput
          :model-value="filters.question"
          placeholder="Search by question text..."
          class="w-full"
          @update:model-value="
            $emit('update:filters', { ...filters, question: $event })
          "
        />
      </div>

      <!-- Trait Filter -->
      <div>
        <label
          class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
        >
          <UIcon name="i-heroicons-tag" class="h-4 w-4" />
          Trait
        </label>
        <USelect
          :model-value="filters.trait"
          :items="traitOptions"
          placeholder="Select traits..."
          value-key="value"
          multiple
          class="w-full"
          @update:model-value="
            $emit('update:filters', { ...filters, trait: $event || [] })
          "
        />
      </div>
    </div>

    <!-- Clear Filters Button (if needed) -->
    <div v-if="hasActiveFilters" class="flex justify-end mb-4">
      <UButton
        variant="ghost"
        size="xs"
        icon="i-heroicons-x-mark"
        @click="$emit('clearFilters')"
      >
        Clear Filters
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ResponseFilters, TraitOption } from "~/types/responses";

interface Props {
  filters: ResponseFilters;
  traitOptions: TraitOption[];
  hasActiveFilters: boolean;
}

defineProps<Props>();

defineEmits<{
  "update:filters": [filters: ResponseFilters];
  clearFilters: [];
}>();
</script>
