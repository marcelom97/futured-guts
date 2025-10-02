<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200">
    <div class="px-6 py-5 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-900">
        Recent Questionnaires
      </h2>
    </div>

    <div v-if="loading" class="p-8 text-center">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 text-primary mx-auto" />
      <p class="mt-2 text-sm text-gray-600">Loading questionnaires...</p>
    </div>

    <div v-else-if="questionnaires.length === 0" class="p-8 text-center">
      <UIcon
        name="i-heroicons-document-text"
        class="mx-auto h-12 w-12 text-gray-400"
      />
      <h3 class="mt-2 text-sm font-medium text-gray-900">
        No questionnaires
      </h3>
      <p class="mt-1 text-sm text-gray-500">
        Get started by creating a new questionnaire.
      </p>
      <div class="mt-6">
        <UButton to="/questionnaires/create" icon="i-heroicons-plus">
          New Questionnaire
        </UButton>
      </div>
    </div>

    <ul v-else class="divide-y divide-gray-200">
      <QuestionnaireCard
        v-for="questionnaire in questionnaires"
        :key="questionnaire.id"
        :questionnaire="questionnaire"
        @click="$emit('questionnaireClick', questionnaire)"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Questionnaire } from '~/types/dashboard';

interface Props {
  questionnaires: Questionnaire[];
  loading: boolean;
}

defineProps<Props>();

defineEmits<{
  questionnaireClick: [questionnaire: Questionnaire];
}>();
</script>