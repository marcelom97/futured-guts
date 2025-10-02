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
              <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-blue-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900">
              Questionnaires
            </h3>
          </div>
          <p class="text-gray-600 mb-6 text-sm flex-grow">
            Design custom questionnaires or use AI to generate questions
          </p>
          <UButton
            to="/questionnaires/create"
            color="primary"
            block
            size="sm"
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
              <UIcon name="i-heroicons-users" class="w-6 h-6 text-green-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900"> Students</h3>
          </div>
          <p class="text-gray-600 mb-6 text-sm flex-grow">
            Add and manage your student roster
          </p>
          <UButton
            to="/students"
            color="primary"
            variant="outline"
            block
            size="sm"
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
              <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-purple-600" />
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
            size="sm"
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
          <li
            v-for="q in questionnaires"
            :key="q.id"
            class="px-6 py-4 hover:bg-gray-50 cursor-pointer transition"
            @click="showQuestionnaireDetails(q)"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-document-text" class="h-5 w-5 text-gray-400" />
                  <h3 class="text-lg font-medium text-gray-900">{{ q.title }}</h3>
                </div>
                <p class="mt-1 text-sm text-gray-500">{{ q.description }}</p>
                <div class="flex items-center gap-1 mt-2">
                  <UIcon name="i-heroicons-calendar" class="h-3 w-3 text-gray-400" />
                  <p class="text-xs text-gray-400">
                    Created {{ new Date(q.created_at).toLocaleDateString() }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <UButton
                  :to="`/questionnaires/${q.id}/responses`"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-document-chart-bar"
                  @click.stop
                >
                  Responses
                </UButton>
                <UButton
                  :to="`/questionnaires/${q.id}/groups`"
                  variant="soft"
                  size="sm"
                  icon="i-heroicons-users"
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
    <UModal
      v-model:open="showDetailsModal"
      :title="selectedQuestionnaire?.title"
    >
      <template #body>
        <div v-if="selectedQuestionnaire" class="space-y-4">
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Description</h4>
            <p class="text-gray-600">{{ selectedQuestionnaire.description }}</p>
          </div>
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Created</h4>
            <p class="text-gray-600">
              {{
                new Date(selectedQuestionnaire.created_at).toLocaleDateString()
              }}
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex gap-2">
          <UButton
            :to="`/questionnaires/${selectedQuestionnaire?.id}`"
            color="primary"
            size="sm"
            icon="i-heroicons-eye"
          >
            View Details
          </UButton>
          <UButton
            :to="`/questionnaires/${selectedQuestionnaire?.id}/responses`"
            variant="outline"
            size="sm"
            icon="i-heroicons-document-chart-bar"
          >
            View Responses
          </UButton>
          <UButton
            :to="`/questionnaires/${selectedQuestionnaire?.id}/groups`"
            variant="soft"
            size="sm"
            icon="i-heroicons-users"
          >
            Generate Groups
          </UButton>
        </div>
      </template>
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

const showDetailsModal = ref(false);
const selectedQuestionnaire = ref<Questionnaire | null>(null);

// Mock teacher ID - in production, use authentication
const teacherId = 1;

function showQuestionnaireDetails(questionnaire: Questionnaire) {
  selectedQuestionnaire.value = questionnaire;
  showDetailsModal.value = true;
}

const { data: response, pending: loading } = await useFetch(
  `/api/questionnaires?teacher_id=${teacherId}`,
  {
    default: () => ({ success: false, questionnaires: [] })
  }
);

// Compute questionnaires from the response
const questionnaires = computed(() => {
  return response.value?.success ? response.value.questionnaires || [] : [];
});
</script>
