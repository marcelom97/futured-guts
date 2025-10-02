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
                <div class="flex gap-4 justify-center">
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
                  placeholder="Enter your answer..."
                  :rows="4"
                />
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
const questionnaire = ref<any>(null);
const loading = ref(true);
const submitting = ref(false);
const submitted = ref(false);

const studentInfo = ref({
  name: "",
  email: "",
});

const responses = ref<Record<number, string>>({});

const isFormValid = computed(() => {
  if (!studentInfo.value.name || !studentInfo.value.email) return false;
  if (!questionnaire.value) return false;

  // Check all questions have responses
  return questionnaire.value.questions.every((q: any) => responses.value[q.id]);
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

async function submitResponses() {
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
  } catch (error) {
    console.error("Failed to submit responses:", error);
    alert("Failed to submit responses. Please try again.");
  } finally {
    submitting.value = false;
  }
}
</script>
