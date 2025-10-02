<template>
  <div class="min-h-screen bg-white">
    <UContainer class="py-12">
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
          <USpinner size="lg" />
        </div>

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
                  <span class="text-sm font-medium text-gray-900">{{
                    response.student_name
                  }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-900 max-w-md truncate">{{
                    response.question_text
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <UBadge
                    :color="getCategoryColor(response.category)"
                    variant="subtle"
                    size="sm"
                  >
                    {{ formatTraits(response.trait) }}
                  </UBadge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">{{
                    response.response_value
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ new Date(response.created_at).toLocaleDateString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </UContainer>
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

function getCategoryColor(
  category: string
): "primary" | "success" | "info" | "warning" | "error" {
  const colorMap: Record<
    string,
    "primary" | "success" | "info" | "warning" | "error"
  > = {
    behavioral: "primary",
    hard_skill: "success",
    soft_skill: "info",
    technical: "warning",
    personality: "error",
  };
  return colorMap[category] || "primary";
}
</script>
