<template>
  <div class="min-h-screen bg-white">
    <UContainer class="py-12">
      <UButton
        to="/"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="mb-4"
      >
        Back to Dashboard
      </UButton>

      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"
        ></div>
      </div>

      <div v-else-if="questionnaire">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">
            {{ questionnaire.title }}
          </h1>
          <p class="mt-2 text-gray-600">{{ questionnaire.description }}</p>
          <p class="mt-2 text-sm text-gray-400">
            Created:
            {{ new Date(questionnaire.created_at).toLocaleDateString() }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 mb-8">
          <UButton
            :to="`/questionnaires/${route.params.id}/responses`"
            color="primary"
            icon="i-heroicons-document-text"
          >
            View Responses
          </UButton>
          <UButton
            :to="`/questionnaires/${route.params.id}/groups`"
            color="primary"
            variant="soft"
            icon="i-heroicons-user-group"
          >
            Generate Groups
          </UButton>
          <UButton
            @click="copyStudentLink"
            color="neutral"
            variant="outline"
            icon="i-heroicons-link"
          >
            Copy Student Link
          </UButton>
        </div>

        <!-- Questions List -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Questions</h2>
          </template>

          <div class="space-y-6">
            <div
              v-for="(question, index) in questionnaire.questions"
              :key="question.id"
              class="pb-6 border-b border-gray-200 last:border-0"
            >
              <div class="flex items-start justify-between mb-2">
                <p class="font-medium text-gray-900">
                  {{ index + 1 }}. {{ question.question_text }}
                </p>
                <UBadge
                  :color="getCategoryColor(question.category)"
                  variant="subtle"
                >
                  {{ formatCategory(question.category) }}
                </UBadge>
              </div>

              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span class="font-medium text-gray-600">Type:</span>
                <span>{{ formatQuestionType(question.question_type) }}</span>
                <span class="text-gray-300">•</span>
                <span class="font-medium text-gray-600">Traits:</span>
                <span>{{ formatTraits(question.trait) }}</span>
                <span class="text-gray-300">•</span>
                <span class="font-medium text-gray-600">Weight:</span>
                <span>{{ formatWeight(question.weight) }}</span>
              </div>

              <div
                v-if="question.options && question.options.length > 0"
                class="mt-3 ml-4"
              >
                <p class="text-sm text-gray-600 mb-1">Options:</p>
                <ul class="list-disc list-inside text-sm text-gray-500">
                  <li v-for="option in question.options" :key="option">
                    {{ option }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const toast = useToast();
const questionnaire = ref<any>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const response: any = await $fetch(
      `/api/questionnaires/${route.params.id}`
    );
    if (response.success) {
      questionnaire.value = response.questionnaire;
    }
  } catch (error) {
    console.error("Failed to fetch questionnaire:", error);
  } finally {
    loading.value = false;
  }
});

function copyStudentLink() {
  const url = `${window.location.origin}/respond/${route.params.id}`;
  navigator.clipboard.writeText(url);
  toast.add({
    title: "Link Copied",
    description: "Student link has been copied to clipboard!",
    color: "success",
    icon: "i-heroicons-check-circle",
  });
}

// Formatting functions for consistent data display
function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    behavioral: "Behavioral",
    hard_skill: "Hard Skill",
    soft_skill: "Soft Skill",
    technical: "Technical",
    personality: "Personality",
  };
  return categoryMap[category] || category;
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

function formatQuestionType(type: string): string {
  const typeMap: Record<string, string> = {
    scale: "Scale (1-5)",
    multiple_choice: "Multiple Choice",
    text: "Text Response",
    yes_no: "Yes/No",
    ranking: "Ranking",
  };
  return typeMap[type] || type;
}

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

function formatWeight(weight: number): string {
  if (weight === 1 || weight === 1.0) return "Standard";
  return `${weight.toFixed(1)}x`;
}
</script>
