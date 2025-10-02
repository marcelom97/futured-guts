<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"
        ></div>
      </div>

      <div v-else-if="submitted" class="text-center py-12">
        <div
          class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4"
        >
          <svg
            class="h-8 w-8 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
        <p class="text-gray-600">
          Your responses have been submitted successfully.
        </p>
      </div>

      <div v-else-if="questionnaire">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            {{ questionnaire.title }}
          </h1>
          <p class="mt-2 text-gray-600">{{ questionnaire.description }}</p>
        </div>

        <!-- Student Info -->
        <UCard class="mb-6">
          <template #header>
            <h2 class="text-lg font-semibold">Your Information</h2>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <UInput
                v-model="studentInfo.name"
                placeholder="Enter your full name"
                size="lg"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <UInput
                v-model="studentInfo.email"
                type="email"
                placeholder="Enter your email"
                size="lg"
                class="w-full"
              />
            </div>
          </div>
        </UCard>

        <!-- Questions -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Questions</h2>
          </template>

          <div class="space-y-8">
            <div
              v-for="(question, index) in questionnaire.questions"
              :key="question.id"
              class="pb-8 border-b border-gray-200 last:border-0"
            >
              <label class="block text-base font-medium text-gray-900 mb-4">
                {{ index + 1 }}. {{ question.question_text }}
                <span class="text-red-500">*</span>
              </label>

              <!-- Scale question -->
              <div v-if="question.question_type === 'scale'" class="space-y-2">
                <div
                  class="flex items-center justify-between text-sm text-gray-600 mb-2"
                >
                  <span>Strongly Disagree</span>
                  <span>Strongly Agree</span>
                </div>
                <div class="flex w-full gap-4 justify-center">
                  <label
                    v-for="value in [1, 2, 3, 4, 5]"
                    :key="value"
                    class="flex flex-col items-center cursor-pointer"
                  >
                    <input
                      v-model="responses[question.id]"
                      type="radio"
                      :value="value.toString()"
                      class="w-6 h-6 text-blue-600"
                    />
                    <span class="mt-1 text-sm text-gray-600">{{ value }}</span>
                  </label>
                </div>
              </div>

              <!-- Multiple choice question -->
              <div
                v-else-if="question.question_type === 'multiple_choice'"
                class="space-y-2"
              >
                <label
                  v-for="option in question.options"
                  :key="option"
                  class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    v-model="responses[question.id]"
                    type="radio"
                    :value="option"
                    class="w-4 h-4 text-blue-600"
                  />
                  <span class="ml-3 text-gray-900">{{ option }}</span>
                </label>
              </div>

              <!-- Text question -->
              <div v-else-if="question.question_type === 'text'">
                <UTextarea
                  v-model="responses[question.id]"
                  class="w-full"
                  placeholder="Enter your answer..."
                  :rows="4"
                />
              </div>

              <!-- Yes/No question -->
              <div
                v-else-if="question.question_type === 'yes_no'"
                class="flex gap-4"
              >
                <label
                  class="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 flex-1"
                  :class="{
                    'border-blue-500 bg-blue-50':
                      responses[question.id] === 'Yes',
                  }"
                >
                  <input
                    v-model="responses[question.id]"
                    type="radio"
                    value="Yes"
                    class="w-5 h-5 text-blue-600"
                  />
                  <span class="ml-3 text-lg font-medium text-gray-900"
                    >Yes</span
                  >
                </label>
                <label
                  class="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 flex-1"
                  :class="{
                    'border-blue-500 bg-blue-50':
                      responses[question.id] === 'No',
                  }"
                >
                  <input
                    v-model="responses[question.id]"
                    type="radio"
                    value="No"
                    class="w-5 h-5 text-blue-600"
                  />
                  <span class="ml-3 text-lg font-medium text-gray-900">No</span>
                </label>
              </div>

              <!-- Ranking question -->
              <div
                v-else-if="question.question_type === 'ranking'"
                class="space-y-3"
              >
                <p class="text-sm text-gray-600 mb-3">
                  Rank these options from highest to lowest preference (1 =
                  highest, {{ question.options.length }} = lowest)
                </p>
                <div
                  v-for="(option, optIdx) in question.options"
                  :key="optIdx"
                  class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  <div class="flex-1">
                    <span class="text-gray-900">{{ option }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <label class="text-sm text-gray-600">Rank:</label>
                    <USelect
                      :model-value="getRankingValue(question.id, optIdx)"
                      @update:model-value="
                        (val) => setRankingValue(question.id, optIdx, val)
                      "
                      :items="
                        getAvailableRanks(
                          question.id,
                          question.options.length,
                          optIdx
                        )
                      "
                      value-key="value"
                      class="w-20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UButton
                @click="submitResponses"
                :loading="submitting"
                :disabled="!isFormValid"
                color="primary"
                size="lg"
                icon="i-heroicons-check"
              >
                Submit Responses
              </UButton>
            </div>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const toast = useToast();
const questionnaire = ref<any>(null);
const loading = ref(true);
const submitting = ref(false);
const submitted = ref(false);

const studentInfo = ref({
  name: "",
  email: "",
});

const responses = ref<Record<number, string>>({});

// Helper functions for ranking questions
function getRankingValue(questionId: number, optionIndex: number) {
  const rankingData = responses.value[questionId];
  if (!rankingData) return "0";
  try {
    const rankings = JSON.parse(rankingData);
    return rankings[optionIndex] || "0";
  } catch {
    return "0";
  }
}

function getAvailableRanks(
  questionId: number,
  totalOptions: number,
  currentOptionIndex: number
) {
  // Generate all possible ranks (starting from 1)
  const allRanks = Array.from({ length: totalOptions }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString(),
  }));

  // Get currently selected ranks for this question
  const rankingData = responses.value[questionId];
  let selectedRanks: string[] = [];

  if (rankingData) {
    try {
      selectedRanks = JSON.parse(rankingData);
    } catch {
      selectedRanks = [];
    }
  }

  // Get the current option's selected rank (if any)
  const currentRank = selectedRanks[currentOptionIndex] || "0";

  // Filter out ranks that are already selected by other options
  const availableRanks = allRanks.filter((rank) => {
    // Always include the current option's rank so it can be changed
    if (rank.value === currentRank && currentRank !== "0") return true;
    // Include ranks that are not selected by any option
    return !selectedRanks.includes(rank.value);
  });

  // Add "0" as the first option (not selected/clear)
  return [{ label: "-", value: "0" }, ...availableRanks];
}

function setRankingValue(
  questionId: number,
  optionIndex: number,
  value: string
) {
  let rankings: string[] = [];
  const existing = responses.value[questionId];

  if (existing) {
    try {
      rankings = JSON.parse(existing);
    } catch {
      rankings = [];
    }
  }

  // Get the question to know how many options there are
  const question = questionnaire.value?.questions.find(
    (q: any) => q.id === questionId
  );
  if (question && question.options) {
    // Initialize array with correct length, default to "0" (not selected)
    while (rankings.length < question.options.length) {
      rankings.push("0");
    }
  }

  // Set the value, treat "0" as not selected
  rankings[optionIndex] = value;
  responses.value[questionId] = JSON.stringify(rankings);
}

function isRankingComplete(questionId: number): boolean {
  const question = questionnaire.value?.questions.find(
    (q: any) => q.id === questionId
  );
  if (!question || !question.options) return false;

  const rankingData = responses.value[questionId];
  if (!rankingData) return false;

  try {
    const rankings = JSON.parse(rankingData);
    // Check that all options have been ranked
    if (rankings.length !== question.options.length) return false;
    // Check that all rankings are filled (not "0" or empty)
    if (rankings.some((r: string) => !r || r === "0")) return false;
    // Check that all ranks are unique (excluding "0")
    const validRanks = rankings.filter((r: string) => r !== "0");
    const uniqueRanks = new Set(validRanks);
    return (
      uniqueRanks.size === validRanks.length &&
      validRanks.length === rankings.length
    );
  } catch {
    return false;
  }
}

const isFormValid = computed(() => {
  if (!studentInfo.value.name || !studentInfo.value.email) return false;
  if (!questionnaire.value) return false;

  // Check all questions have responses
  return questionnaire.value.questions.every((q: any) => {
    if (q.question_type === "ranking") {
      return isRankingComplete(q.id);
    }
    return responses.value[q.id];
  });
});

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

// Validation functions
function validateStudentInfo(): boolean {
  if (!studentInfo.value.name.trim()) {
    toast.add({
      title: "Validation Error",
      description: "Please enter your name",
      color: "error",
      icon: "i-heroicons-exclamation-circle",
    });
    return false;
  }

  if (!studentInfo.value.email.trim()) {
    toast.add({
      title: "Validation Error",
      description: "Please enter your email",
      color: "error",
      icon: "i-heroicons-exclamation-circle",
    });
    return false;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(studentInfo.value.email)) {
    toast.add({
      title: "Validation Error",
      description: "Please enter a valid email address",
      color: "error",
      icon: "i-heroicons-exclamation-circle",
    });
    return false;
  }

  return true;
}

function validateAllQuestions(): { valid: boolean; firstError?: string } {
  if (!questionnaire.value || !questionnaire.value.questions) {
    return { valid: false };
  }

  for (let i = 0; i < questionnaire.value.questions.length; i++) {
    const question = questionnaire.value.questions[i];
    const response = responses.value[question.id];

    if (question.question_type === "ranking") {
      if (!isRankingComplete(question.id)) {
        return {
          valid: false,
          firstError: `Question ${i + 1}: Please rank all options from 1 to ${
            question.options?.length || 0
          }`,
        };
      }
    } else {
      if (!response || response.trim() === "") {
        return {
          valid: false,
          firstError: `Question ${i + 1}: This question is required`,
        };
      }
    }
  }

  return { valid: true };
}

async function submitResponses() {
  // Validate student info first
  if (!validateStudentInfo()) {
    return;
  }

  // Validate all questions
  const questionValidation = validateAllQuestions();
  if (!questionValidation.valid) {
    toast.add({
      title: "Incomplete Form",
      description:
        questionValidation.firstError || "Please answer all questions",
      color: "error",
      icon: "i-heroicons-exclamation-circle",
    });
    return;
  }

  submitting.value = true;
  try {
    // First, create/get student
    const studentResponse = await $fetch("/api/students", {
      method: "POST",
      body: {
        name: studentInfo.value.name,
        email: studentInfo.value.email,
        teacher_id: questionnaire.value.teacher_id,
      },
    });

    // Then submit responses
    const responseData = Object.entries(responses.value).map(
      ([questionId, value]) => ({
        question_id: parseInt(questionId),
        response_value: value,
      })
    );

    await $fetch("/api/responses", {
      method: "POST",
      body: {
        student_id: studentResponse.student_id,
        responses: responseData,
      },
    });

    submitted.value = true;
    toast.add({
      title: "Success",
      description: "Your responses have been submitted successfully",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
  } catch (error: any) {
    console.error("Failed to submit responses:", error);
    toast.add({
      title: "Submission Failed",
      description:
        error.data?.message ||
        error.message ||
        "Failed to submit responses. Please try again.",
      color: "error",
      icon: "i-heroicons-x-circle",
    });
  } finally {
    submitting.value = false;
  }
}
</script>
