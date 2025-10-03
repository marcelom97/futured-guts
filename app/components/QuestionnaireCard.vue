<template>
  <li
    class="px-6 py-4 hover:bg-gray-50 cursor-pointer transition"
    @click="$emit('click', questionnaire)"
  >
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-document-text" class="h-5 w-5 text-gray-400" />
          <h3 class="text-lg font-medium text-gray-900">{{ questionnaire.title }}</h3>
        </div>
        <p class="mt-1 text-sm text-gray-500">{{ questionnaire.description }}</p>
        <div class="flex items-center gap-1 mt-2">
          <UIcon name="i-heroicons-calendar" class="h-3 w-3 text-gray-400" />
          <p class="text-xs text-gray-400">
            Created {{ formatDate(questionnaire.created_at) }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          :to="`/questionnaires/${questionnaire.id}/responses`"
          variant="ghost"
          size="sm"
          icon="i-heroicons-document-chart-bar"
          @click.stop
        >
          View Responses
        </UButton>
        <UButton
          :to="`/questionnaires/${questionnaire.id}/groups`"
          size="sm"
          icon="i-heroicons-users"
          @click.stop
        >
          Generate Groups
        </UButton>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { Questionnaire } from '~/types/dashboard';

interface Props {
  questionnaire: Questionnaire;
}

defineProps<Props>();
defineEmits<{
  click: [questionnaire: Questionnaire];
}>();

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}
</script>