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
            <h3 class="text-lg font-semibold text-gray-900">View Groups</h3>
          </div>
          <p class="text-gray-600 mb-6 text-sm flex-grow">
            Visualize and manage generated student groups
          </p>
          <UButton
            @click="showGroupsModal = true"
            color="primary"
            variant="soft"
            block
            icon="i-heroicons-chart-bar"
          >
            View All Groups
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
            @click="navigateTo(`/questionnaires/${q.id}`)"
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

    <!-- Groups Modal -->
    <UModal v-model="showGroupsModal">
      <UCard variant="outline">
        <template #header>
          <h3 class="text-lg font-semibold">All Questionnaires</h3>
        </template>
        <div class="space-y-2">
          <div
            v-for="q in questionnaires"
            :key="q.id"
            class="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            @click="navigateTo(`/questionnaires/${q.id}/groups`)"
          >
            <p class="font-medium">{{ q.title }}</p>
            <p class="text-sm text-gray-500">View groups</p>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const questionnaires = ref<any[]>([]);
const loading = ref(true);
const showGroupsModal = ref(false);

// Mock teacher ID - in production, use authentication
const teacherId = 1;

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
