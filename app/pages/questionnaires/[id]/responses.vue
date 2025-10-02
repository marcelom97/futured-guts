<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <UButton
        :to="`/questionnaires/${route.params.id}`"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="mb-4"
      >
        Back to Questionnaire
      </UButton>

      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Student Responses</h1>
        <p class="mt-2 text-gray-600">
          Review student responses to questionnaire
        </p>
      </div>

      <UCard>
        <div v-if="loading" class="text-center py-8">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"
          ></div>
        </div>

        <div v-else-if="responses.length === 0" class="text-center py-12">
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
            No responses yet
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Students haven't submitted any responses yet.
          </p>
        </div>

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
              <tr
                v-for="response in responses"
                :key="response.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ response.student_name }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-md truncate">
                    {{ response.question_text }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="text-xs px-2 py-1 rounded-full font-medium"
                    :class="{
                      'bg-blue-100 text-blue-700':
                        response.category === 'behavioral',
                      'bg-green-100 text-green-700':
                        response.category === 'hard_skill',
                      'bg-purple-100 text-purple-700':
                        response.category === 'soft_skill',
                      'bg-orange-100 text-orange-700':
                        response.category === 'technical',
                      'bg-pink-100 text-pink-700':
                        response.category === 'personality',
                    }"
                  >
                    {{ formatTraits(response.trait) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ response.response_value }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ new Date(response.created_at).toLocaleDateString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const responses = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await $fetch(
      `/api/responses/questionnaire/${route.params.id}`
    );
    if (response.success) {
      responses.value = response.responses;
    }
  } catch (error) {
    console.error("Failed to load responses:", error);
  } finally {
    loading.value = false;
  }
});

// Formatting function for consistent data display
function formatTraits(traits: string | string[]): string {
  if (!traits) return "None";

  const formatSingleTrait = (trait: string): string => {
    return trait
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (typeof traits === "string") return formatSingleTrait(traits);
  if (Array.isArray(traits)) {
    return traits.map(formatSingleTrait).join(", ");
  }
  return "None";
}
</script>
