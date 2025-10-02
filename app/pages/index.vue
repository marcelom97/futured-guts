<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <DashboardHeader
        title="Teacher Dashboard"
        subtitle="Intelligent Student Grouping Platform"
      />

      <!-- Quick Actions -->
      <QuickActionsGrid />

      <!-- Recent Questionnaires -->
      <QuestionnairesList
        :questionnaires="questionnaires"
        :loading="loading"
        @questionnaire-click="showQuestionnaireDetails"
      />
    </div>

    <!-- Questionnaire Details Modal -->
    <QuestionnaireModal
      v-model="showDetailsModal"
      :questionnaire="selectedQuestionnaire"
    />
  </div>
</template>

<script setup lang="ts">
import type { Questionnaire, QuestionnaireResponse } from '~/types/dashboard';

const showDetailsModal = ref(false);
const selectedQuestionnaire = ref<Questionnaire | null>(null);

// Mock teacher ID - in production, use authentication
const teacherId = 1;

function showQuestionnaireDetails(questionnaire: Questionnaire) {
  selectedQuestionnaire.value = questionnaire;
  showDetailsModal.value = true;
}

const { data: response, pending: loading } = await useFetch<QuestionnaireResponse>(
  `/api/questionnaires?teacher_id=${teacherId}`,
  {
    default: (): QuestionnaireResponse => ({ success: false, questionnaires: [] })
  }
);

// Compute questionnaires from the response
const questionnaires = computed(() => {
  return response.value?.success ? response.value.questionnaires || [] : [];
});
</script>
