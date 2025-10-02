<template>
  <div class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <UIcon
            name="i-heroicons-document-text"
            class="h-4 w-4 text-gray-400"
          />
          <h3 class="text-sm font-medium text-gray-900">
            {{ questionnaire.title }}
          </h3>
        </div>
        <p
          v-if="questionnaire.description"
          class="text-xs text-gray-500 mt-1 ml-6"
        >
          {{ questionnaire.description }}
        </p>
        <div class="flex items-center gap-4 mt-2 ml-6">
          <div class="flex items-center gap-1">
            <UIcon
              name="i-heroicons-clipboard-document-check"
              class="h-3 w-3 text-gray-400"
            />
            <span class="text-xs text-gray-500">
              {{ questionnaire.answered_questions }}/{{
                questionnaire.total_questions
              }}
              questions answered
            </span>
          </div>
          <div class="flex items-center">
            <div class="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
              <div
                class="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                :style="{
                  width: questionnaire.completion_percentage + '%',
                }"
              />
            </div>
            <span class="text-xs text-gray-500"
              >{{ questionnaire.completion_percentage }}%</span
            >
          </div>
        </div>
        <div class="flex items-center gap-1 mt-1 ml-6">
          <UIcon
            name="i-heroicons-calendar"
            class="h-3 w-3 text-gray-400"
          />
          <p class="text-xs text-gray-400">
            Created {{ formatDate(questionnaire.created_at) }}
          </p>
        </div>
      </div>
      <div class="flex gap-2">
        <UButton
          size="xs"
          color="success"
          variant="outline"
          icon="i-heroicons-document-chart-bar"
          @click="$emit('viewResponses')"
        >
          View All Responses
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StudentQuestionnaire } from '~/types/students';

interface Props {
  questionnaire: StudentQuestionnaire;
}

defineProps<Props>();

defineEmits<{
  viewResponses: [];
}>();

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}
</script>