<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">Responses</h3>
        <div v-if="!loading && responses.length > 0" class="text-sm text-gray-500">
          Showing {{ filteredResponses.length }} of {{ responses.length }} responses
        </div>
      </div>
    </template>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"
      />
    </div>

    <!-- No Responses State -->
    <div v-else-if="responses.length === 0" class="text-center py-12">
      <UIcon
        name="i-heroicons-document-text"
        class="mx-auto h-12 w-12 text-gray-400"
      />
      <h3 class="mt-2 text-sm font-medium text-gray-900">
        No responses yet
      </h3>
      <p class="mt-1 text-sm text-gray-500">
        Students haven't submitted any responses yet.
      </p>
    </div>

    <!-- No Filtered Results State -->
    <div v-else-if="filteredResponses.length === 0" class="text-center py-12">
      <UIcon
        name="i-heroicons-funnel"
        class="mx-auto h-12 w-12 text-gray-400"
      />
      <h3 class="mt-2 text-sm font-medium text-gray-900">
        No responses match your filters
      </h3>
      <p class="mt-1 text-sm text-gray-500">
        Try adjusting your filter criteria to see more results.
      </p>
      <div class="mt-4">
        <UButton
          variant="outline"
          size="sm"
          icon="i-heroicons-x-mark"
          @click="$emit('clearFilters')"
        >
          Clear Filters
        </UButton>
      </div>
    </div>

    <!-- Responses Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Student
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Question
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Trait
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Response
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Submitted
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <ResponsesTableRow
            v-for="response in filteredResponses"
            :key="response.id"
            :response="response"
          />
        </tbody>
      </table>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Response } from '~/types/responses';

interface Props {
  responses: Response[];
  filteredResponses: Response[];
  loading: boolean;
}

defineProps<Props>();

defineEmits<{
  clearFilters: [];
}>();
</script>