<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="mb-8">
        <UButton
          to="/"
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-left"
          class="mb-4"
        >
          Back to Dashboard
        </UButton>
        <h1 class="text-3xl font-bold text-gray-900">Create Questionnaire</h1>
        <p class="mt-2 text-gray-600">
          Design a custom questionnaire or use AI to generate questions
        </p>
      </div>

      <!-- Main Form -->
      <UCard class="mb-6">
        <template #header>
          <h2 class="text-xl font-semibold">Questionnaire Details</h2>
        </template>

        <div class="space-y-6">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <UInput
              v-model="questionnaire.title"
              placeholder="e.g., Fall 2024 Project Team Formation"
              size="lg"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <UTextarea
              v-model="questionnaire.description"
              placeholder="Describe the purpose of this questionnaire..."
              :rows="3"
            />
          </div>

          <!-- AI Generation Section -->
          <div class="border-t pt-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  AI Question Generation
                </h3>
                <p class="text-sm text-gray-500">
                  Let AI generate questions based on focus areas
                </p>
              </div>
              <UButton
                @click="showAIModal = true"
                color="primary"
                variant="soft"
                icon="i-heroicons-sparkles"
              >
                Generate with AI
              </UButton>
            </div>
          </div>

          <!-- Questions List -->
          <div class="border-t pt-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Questions</h3>
              <UButton
                @click="addQuestion"
                color="primary"
                variant="outline"
                icon="i-heroicons-plus"
              >
                Add Question
              </UButton>
            </div>

            <div
              v-if="questions.length === 0"
              class="text-center py-8 text-gray-500"
            >
              No questions added yet. Use AI generation or add manually.
            </div>

            <div v-else class="space-y-4">
              <UCard
                v-for="(question, index) in questions"
                :key="index"
                class="relative"
              >
                <button
                  @click="removeQuestion(index)"
                  class="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>

                <div class="space-y-4">
                  <UInput
                    v-model="question.question_text"
                    placeholder="Enter question text..."
                    size="lg"
                  />

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs text-gray-500 mb-1"
                        >Type</label
                      >
                      <USelectMenu
                        v-model="question.question_type"
                        :options="questionTypes"
                      />
                    </div>

                    <div>
                      <label class="block text-xs text-gray-500 mb-1"
                        >Category</label
                      >
                      <USelectMenu
                        v-model="question.category"
                        :options="categories"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs text-gray-500 mb-1"
                        >Trait</label
                      >
                      <UInput
                        v-model="question.trait"
                        placeholder="e.g., teamwork, math"
                      />
                    </div>

                    <div>
                      <label class="block text-xs text-gray-500 mb-1"
                        >Weight</label
                      >
                      <UInput
                        v-model.number="question.weight"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                      />
                    </div>
                  </div>

                  <!-- Multiple choice options -->
                  <div v-if="question.question_type === 'multiple_choice'">
                    <label class="block text-xs text-gray-500 mb-2"
                      >Options</label
                    >
                    <div class="space-y-2">
                      <div
                        v-for="(option, optIndex) in question.options"
                        :key="optIndex"
                        class="flex gap-2"
                      >
                        <UInput
                          v-model="question.options[optIndex]"
                          placeholder="Option text"
                          class="flex-1"
                        />
                        <UButton
                          @click="question.options.splice(optIndex, 1)"
                          color="error"
                          variant="ghost"
                          icon="i-heroicons-trash"
                        />
                      </div>
                      <UButton
                        @click="question.options.push('')"
                        color="neutral"
                        variant="outline"
                        size="sm"
                        icon="i-heroicons-plus"
                      >
                        Add Option
                      </UButton>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton to="/" color="neutral" variant="outline">Cancel</UButton>
            <UButton
              @click="saveQuestionnaire"
              :loading="saving"
              color="primary"
              icon="i-heroicons-check"
            >
              Create Questionnaire
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <!-- AI Generation Modal -->
    <UModal v-model="showAIModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">AI Question Generation</h3>
        </template>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Focus Areas
            </label>
            <p class="text-xs text-gray-500 mb-2">
              Enter traits or skills you want to assess (comma-separated)
            </p>
            <UInput
              v-model="aiFocusAreas"
              placeholder="e.g., teamwork, leadership, communication, math, writing"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <UInput
              v-model.number="aiNumQuestions"
              type="number"
              min="3"
              max="20"
            />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              @click="showAIModal = false"
              color="neutral"
              variant="outline"
            >
              Cancel
            </UButton>
            <UButton
              @click="generateQuestions"
              :loading="generating"
              color="primary"
              icon="i-heroicons-sparkles"
            >
              Generate Questions
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const questionnaire = ref({
  title: "",
  description: "",
  teacher_id: 1, // Mock - use auth in production
});

const questions = ref<any[]>([]);
const saving = ref(false);
const generating = ref(false);
const showAIModal = ref(false);
const aiFocusAreas = ref("teamwork, leadership, communication");
const aiNumQuestions = ref(10);

const questionTypes = ["scale", "multiple_choice", "text"];
const categories = ["behavioral", "hard_skill"];

function addQuestion() {
  questions.value.push({
    question_text: "",
    question_type: "scale",
    category: "behavioral",
    trait: "",
    weight: 1.0,
    options: [],
  });
}

function removeQuestion(index: number) {
  questions.value.splice(index, 1);
}

async function generateQuestions() {
  generating.value = true;
  try {
    const focusAreas = aiFocusAreas.value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    const response = await $fetch<{ success: boolean; questions: any[] }>(
      "/api/ai/generate-questions",
      {
        method: "POST",
        body: {
          focus_areas: focusAreas,
          num_questions: aiNumQuestions.value,
        },
      }
    );

    if (response.success && response.questions) {
      questions.value = response.questions;
      showAIModal.value = false;
    }
  } catch (error) {
    console.error("Failed to generate questions:", error);
    alert("Failed to generate questions. Please try again.");
  } finally {
    generating.value = false;
  }
}

async function saveQuestionnaire() {
  if (!questionnaire.value.title) {
    alert("Please enter a title");
    return;
  }

  if (questions.value.length === 0) {
    alert("Please add at least one question");
    return;
  }

  saving.value = true;
  try {
    const response = await $fetch("/api/questionnaires", {
      method: "POST",
      body: {
        ...questionnaire.value,
        questions: questions.value,
      },
    });

    if (response.success) {
      await navigateTo(`/questionnaires/${response.questionnaire_id}`);
    }
  } catch (error) {
    console.error("Failed to save questionnaire:", error);
    alert("Failed to save questionnaire. Please try again.");
  } finally {
    saving.value = false;
  }
}
</script>
