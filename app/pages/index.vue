<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p class="mt-2 text-lg text-gray-600">
          Intelligent Student Grouping Platform
        </p>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="p-3 bg-blue-50 rounded-lg">
              <svg
                class="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">
              Create Questionnaire
            </h3>
          </div>
          <p class="text-gray-600 mb-6 text-sm flex-grow">
            Design custom questionnaires or use AI to generate questions
          </p>
          <UButton
            to="/questionnaires/create"
            color="primary"
            block
            icon="i-heroicons-plus"
          >
            New Questionnaire
          </UButton>
        </div>

        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="p-3 bg-green-50 rounded-lg">
              <svg
                class="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Manage Students</h3>
          </div>
          <p class="text-gray-600 mb-6 text-sm flex-grow">
            Add and manage your student roster
          </p>
          <UButton
            to="/students"
            color="primary"
            variant="outline"
            block
            icon="i-heroicons-user-group"
          >
            View Students
          </UButton>
        </div>

        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="p-3 bg-purple-50 rounded-lg">
              <svg
                class="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Analytics</h3>
          </div>
          <p class="text-gray-600 mb-6 text-sm flex-grow">
            View insights and analytics from your questionnaires
          </p>
          <UButton
            color="primary"
            variant="soft"
            block
            icon="i-heroicons-chart-bar"
            disabled
          >
            Coming Soon
          </UButton>
        </div>
      </div>

      <!-- Recent Questionnaires -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-5 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">
            Recent Questionnaires
          </h2>
        </div>

        <div v-if="loading" class="p-8 text-center">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"
          ></div>
        </div>

        <div v-else-if="questionnaires.length === 0" class="p-8 text-center">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
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
          <li
            v-for="q in questionnaires"
            :key="q.id"
            class="px-6 py-4 hover:bg-gray-50 cursor-pointer transition"
            @click="showQuestionnaireDetails(q)"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900">{{ q.title }}</h3>
                <p class="mt-1 text-sm text-gray-500">{{ q.description }}</p>
                <p class="mt-2 text-xs text-gray-400">
                  Created: {{ new Date(q.created_at).toLocaleDateString() }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <UButton
                  :to="`/questionnaires/${q.id}/responses`"
                  variant="ghost"
                  icon="i-heroicons-document-text"
                  @click.stop
                >
                  Responses
                </UButton>
                <UButton
                  :to="`/questionnaires/${q.id}/groups`"
                  variant="soft"
                  icon="i-heroicons-user-group"
                  @click.stop
                >
                  Generate Groups
                </UButton>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Questionnaire Details Modal -->
    <UModal v-model="showDetailsModal">
      <UCard v-if="selectedQuestionnaire" variant="outline">
        <template #header>
          <h3 class="text-lg font-semibold">{{ selectedQuestionnaire.title }}</h3>
        </template>
        <div class="space-y-4">
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Description</h4>
            <p class="text-gray-600">{{ selectedQuestionnaire.description }}</p>
          </div>
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Created</h4>
            <p class="text-gray-600">{{ new Date(selectedQuestionnaire.created_at).toLocaleDateString() }}</p>
          </div>
          <div class="flex gap-2 pt-4">
            <UButton
              :to="`/questionnaires/${selectedQuestionnaire.id}`"
              color="primary"
              icon="i-heroicons-eye"
            >
              View Details
            </UButton>
            <UButton
              :to="`/questionnaires/${selectedQuestionnaire.id}/responses`"
              variant="outline"
              icon="i-heroicons-document-text"
            >
              View Responses
            </UButton>
            <UButton
              :to="`/questionnaires/${selectedQuestionnaire.id}/groups`"
              variant="soft"
              icon="i-heroicons-user-group"
            >
              Generate Groups
            </UButton>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface Questionnaire {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

const questionnaires = ref<Questionnaire[]>([]);
const loading = ref(true);
const showDetailsModal = ref(false);
const selectedQuestionnaire = ref<Questionnaire | null>(null);

// Mock teacher ID - in production, use authentication
const teacherId = 1;

function showQuestionnaireDetails(questionnaire: Questionnaire) {
  selectedQuestionnaire.value = questionnaire;
  showDetailsModal.value = true;
}

onMounted(async () => {
  try {
    const response = await $fetch(
      `/api/questionnaires?teacher_id=${teacherId}`
    );
    if (response.success) {
      questionnaires.value = response.questionnaires || [];
    }
  } catch (error) {
    console.error("Failed to fetch questionnaires:", error);
  } finally {
    loading.value = false;
  }
});
</script>
