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
              class="w-full"
              :error="!!questionnaireErrors.title"
              @blur="validateQuestionnaire"
            />
            <p
              v-if="questionnaireErrors.title"
              class="mt-1 text-sm text-red-600"
            >
              {{ questionnaireErrors.title }}
            </p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <UTextarea
              v-model="questionnaire.description"
              placeholder="Describe the purpose of this questionnaire..."
              class="w-full"
              :rows="3"
              :error="!!questionnaireErrors.description"
              @blur="validateQuestionnaire"
            />
            <p
              v-if="questionnaireErrors.description"
              class="mt-1 text-sm text-red-600"
            >
              {{ questionnaireErrors.description }}
            </p>
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
                :loading="generating"
                :disabled="generating"
                color="primary"
                variant="soft"
                icon="i-heroicons-sparkles"
              >
                {{ generating ? "Generating..." : "Generate with AI" }}
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
                  <div>
                    <UInput
                      v-model="question.question_text"
                      placeholder="Enter question text..."
                      class="w-full"
                      :error="!!questionErrors[index]?.question_text"
                      @blur="validateQuestion(index)"
                    />
                    <p
                      v-if="questionErrors[index]?.question_text"
                      class="mt-1 text-sm text-red-600"
                    >
                      {{ questionErrors[index].question_text }}
                    </p>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs text-gray-500 mb-1"
                        >Type</label
                      >
                      <USelectMenu
                        v-model="question.question_type"
                        :items="questionTypes"
                        value-key="value"
                        :search-input="false"
                        class="w-full"
                        :error="!!questionErrors[index]?.question_type"
                        @change="validateQuestion(index)"
                      />
                      <p
                        v-if="questionErrors[index]?.question_type"
                        class="mt-1 text-sm text-red-600"
                      >
                        {{ questionErrors[index].question_type }}
                      </p>
                    </div>

                    <div>
                      <label class="block text-xs text-gray-500 mb-1"
                        >Category</label
                      >
                      <USelectMenu
                        v-model="question.category"
                        :items="categories"
                        value-key="value"
                        :search-input="false"
                        class="w-full"
                        :error="!!questionErrors[index]?.category"
                        @change="validateQuestion(index)"
                      />
                      <p
                        v-if="questionErrors[index]?.category"
                        class="mt-1 text-sm text-red-600"
                      >
                        {{ questionErrors[index].category }}
                      </p>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs text-gray-500 mb-1"
                        >Traits</label
                      >
                      <USelectMenu
                        v-model="question.trait"
                        :items="traitOptions"
                        value-key="value"
                        :search-input="false"
                        class="w-full"
                        :error="!!questionErrors[index]?.trait"
                        @change="validateQuestion(index)"
                        multiple
                        placeholder="Select traits..."
                      />
                      <p
                        v-if="questionErrors[index]?.trait"
                        class="mt-1 text-sm text-red-600"
                      >
                        {{ questionErrors[index].trait }}
                      </p>
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
                        class="w-full"
                        :error="!!questionErrors[index]?.weight"
                        @blur="validateQuestion(index)"
                      />
                      <p
                        v-if="questionErrors[index]?.weight"
                        class="mt-1 text-sm text-red-600"
                      >
                        {{ questionErrors[index].weight }}
                      </p>
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
                          :error="!!questionErrors[index]?.options?.[optIndex]"
                          @blur="validateQuestion(index)"
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
                      <p
                        v-if="questionErrors[index]?.options"
                        class="mt-1 text-sm text-red-600"
                      >
                        {{ questionErrors[index].options }}
                      </p>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              to="/"
              color="neutral"
              variant="outline"
              :disabled="saving"
            >
              Cancel
            </UButton>
            <UButton
              @click="saveQuestionnaire"
              :loading="saving"
              :disabled="saving"
              color="primary"
              icon="i-heroicons-check"
            >
              {{ saving ? "Creating..." : "Create Questionnaire" }}
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <!-- AI Generation Modal -->
    <UModal v-model:open="showAIModal" title="AI Question Generation">
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Focus Areas
            </label>
            <p class="text-xs text-gray-500 mb-2">
              Select the traits or skills you want to assess
            </p>
            <USelectMenu
              v-model="aiFocusAreas"
              :items="traitOptions"
              value-key="value"
              :search-input="false"
              class="w-full"
              :error="!!aiModalErrors.focus_areas"
              @change="validateAIModal"
              multiple
              placeholder="Select traits..."
            />
            <p
              v-if="aiModalErrors.focus_areas"
              class="mt-1 text-sm text-red-600"
            >
              {{ aiModalErrors.focus_areas }}
            </p>
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
              class="w-full"
              :error="!!aiModalErrors.num_questions"
              @blur="validateAIModal"
            />
            <p
              v-if="aiModalErrors.num_questions"
              class="mt-1 text-sm text-red-600"
            >
              {{ aiModalErrors.num_questions }}
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <UButton
            @click="showAIModal = false"
            color="neutral"
            variant="outline"
            :disabled="generating"
          >
            Cancel
          </UButton>
          <UButton
            @click="generateQuestions"
            :loading="generating"
            :disabled="generating"
            color="primary"
            icon="i-heroicons-sparkles"
          >
            {{ generating ? "Generating..." : "Generate Questions" }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const toast = useToast();

// Zod schemas
const questionnaireSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z.union([
    z.string().max(1000, "Description must be less than 1000 characters"),
    z.literal(""),
  ]),
  teacher_id: z.number().positive(),
});

const questionSchema = z
  .object({
    question_text: z
      .string()
      .min(1, "Question text is required")
      .max(500, "Question text must be less than 500 characters"),
    question_type: z.enum(
      ["scale", "multiple_choice", "text", "yes_no", "ranking"],
      {
        message: "Please select a valid question type",
      }
    ),
    category: z.enum(
      ["behavioral", "hard_skill", "soft_skill", "technical", "personality"],
      {
        message: "Please select a valid category",
      }
    ),
    trait: z
      .array(z.string())
      .min(1, "At least one trait must be selected")
      .max(5, "Maximum 5 traits can be selected"),
    weight: z
      .number()
      .min(0, "Weight must be at least 0")
      .max(5, "Weight must be at most 5"),
    options: z.array(z.string().min(1, "Option cannot be empty")).optional(),
  })
  .refine(
    (data) => {
      if (data.question_type === "multiple_choice") {
        return data.options && data.options.length >= 2;
      }
      return true;
    },
    {
      message: "Multiple choice questions must have at least 2 options",
      path: ["options"],
    }
  );

const aiModalSchema = z.object({
  focus_areas: z
    .array(z.string())
    .min(1, "At least one trait must be selected")
    .max(5, "Maximum 5 traits can be selected"),
  num_questions: z
    .number()
    .min(3, "Must generate at least 3 questions")
    .max(20, "Cannot generate more than 20 questions"),
});

// Form data
const questionnaire = ref({
  title: "",
  description: "",
  teacher_id: 1, // Mock - use auth in production
});

const questions = ref<any[]>([]);
const saving = ref(false);
const generating = ref(false);
const showAIModal = ref(false);
const aiFocusAreas = ref<string[]>(["teamwork", "leadership", "communication"]);
const aiNumQuestions = ref(10);

// Error states
const questionnaireErrors = ref<Record<string, string>>({});
const questionErrors = ref<Record<number, Record<string, string>>>({});
const aiModalErrors = ref<Record<string, string>>({});

// Validation functions
function validateQuestionnaire() {
  try {
    questionnaireSchema.parse(questionnaire.value);
    questionnaireErrors.value = {};
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      questionnaireErrors.value = {};
      error.issues.forEach((err) => {
        if (err.path[0]) {
          questionnaireErrors.value[err.path[0] as string] = err.message;
        }
      });
    }
    return false;
  }
}

function validateQuestion(questionIndex: number) {
  try {
    const question = questions.value[questionIndex];
    questionSchema.parse(question);
    questionErrors.value[questionIndex] = {};
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      questionErrors.value[questionIndex] = {};
      error.issues.forEach((err) => {
        if (err.path[0]) {
          if (!questionErrors.value[questionIndex]) {
            questionErrors.value[questionIndex] = {};
          }
          questionErrors.value[questionIndex][err.path[0] as string] =
            err.message;
        }
      });
    }
    return false;
  }
}

function validateAIModal() {
  try {
    aiModalSchema.parse({
      focus_areas: aiFocusAreas.value,
      num_questions: aiNumQuestions.value,
    });
    aiModalErrors.value = {};
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      aiModalErrors.value = {};
      error.issues.forEach((err) => {
        if (err.path[0]) {
          aiModalErrors.value[err.path[0] as string] = err.message;
        }
      });
    }
    return false;
  }
}

function validateAllQuestions() {
  let allValid = true;
  questions.value.forEach((_, index) => {
    if (!validateQuestion(index)) {
      allValid = false;
    }
  });
  return allValid;
}

const questionTypes = [
  { label: "Scale (1-5)", value: "scale" },
  { label: "Multiple Choice", value: "multiple_choice" },
  { label: "Text Response", value: "text" },
  { label: "Yes/No", value: "yes_no" },
  { label: "Ranking", value: "ranking" },
];

const categories = [
  { label: "Behavioral", value: "behavioral" },
  { label: "Hard Skills", value: "hard_skill" },
  { label: "Soft Skills", value: "soft_skill" },
  { label: "Technical", value: "technical" },
  { label: "Personality", value: "personality" },
];

const traitOptions = [
  { label: "Teamwork", value: "teamwork" },
  { label: "Leadership", value: "leadership" },
  { label: "Communication", value: "communication" },
  { label: "Problem Solving", value: "problem_solving" },
  { label: "Creativity", value: "creativity" },
];

function addQuestion() {
  questions.value.push({
    question_text: "",
    question_type: "scale",
    category: "behavioral",
    trait: [],
    weight: 1.0,
    options: [],
  });
  // Initialize error state for the new question
  questionErrors.value[questions.value.length - 1] = {};
}

function removeQuestion(index: number) {
  questions.value.splice(index, 1);
  // Clean up error state for removed question
  delete questionErrors.value[index];
  // Reindex remaining error states
  const newErrors: Record<number, Record<string, string>> = {};
  Object.keys(questionErrors.value).forEach((key) => {
    const idx = parseInt(key);
    const errorData = questionErrors.value[idx];
    if (errorData) {
      if (idx > index) {
        newErrors[idx - 1] = errorData;
      } else if (idx < index) {
        newErrors[idx] = errorData;
      }
    }
  });
  questionErrors.value = newErrors;
}

async function generateQuestions() {
  if (!validateAIModal()) {
    const errors = Object.values(aiModalErrors.value);
    toast.add({
      title: "Validation Error",
      description: errors.join(", "),
      color: "error",
      icon: "i-heroicons-exclamation-circle",
    });
    return;
  }

  generating.value = true;
  try {
    const response = await $fetch<{ success: boolean; questions: any[] }>(
      "/api/ai/generate-questions",
      {
        method: "POST",
        body: {
          focus_areas: aiFocusAreas.value,
          num_questions: aiNumQuestions.value,
        },
      }
    );

    if (response.success && response.questions) {
      questions.value = response.questions;
      showAIModal.value = false;
      toast.add({
        title: "Success",
        description: `Generated ${response.questions.length} questions successfully`,
        color: "success",
        icon: "i-heroicons-sparkles",
      });
    }
  } catch (error: any) {
    console.error("Failed to generate questions:", error);
    toast.add({
      title: "AI Generation Failed",
      description:
        error.data?.message ||
        error.message ||
        "Failed to generate questions. Please try again.",
      color: "error",
      icon: "i-heroicons-x-circle",
    });
  } finally {
    generating.value = false;
  }
}

async function saveQuestionnaire() {
  // Validate questionnaire details
  if (!validateQuestionnaire()) {
    const errors = Object.values(questionnaireErrors.value);
    toast.add({
      title: "Validation Error",
      description: errors.join(", "),
      color: "error",
      icon: "i-heroicons-exclamation-circle",
    });
    return;
  }

  // Validate all questions
  if (questions.value.length === 0) {
    toast.add({
      title: "No Questions",
      description: "Please add at least one question",
      color: "warning",
      icon: "i-heroicons-exclamation-triangle",
    });
    return;
  }

  if (!validateAllQuestions()) {
    // Count how many questions have errors
    const errorCount = Object.keys(questionErrors.value).filter(
      (key) => Object.keys(questionErrors.value[parseInt(key)] || {}).length > 0
    ).length;
    toast.add({
      title: "Question Validation Error",
      description: `${errorCount} question(s) have validation errors. Please check all required fields.`,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
    });
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
      toast.add({
        title: "Success",
        description: "Questionnaire created successfully",
        color: "success",
        icon: "i-heroicons-check-circle",
      });
      await navigateTo(`/questionnaires/${response.questionnaire_id}`);
    } else {
      toast.add({
        title: "Error",
        description: "Failed to create questionnaire",
        color: "error",
        icon: "i-heroicons-x-circle",
      });
    }
  } catch (error: any) {
    console.error("Failed to save questionnaire:", error);
    toast.add({
      title: "Error",
      description:
        error.data?.message ||
        error.message ||
        "Failed to save questionnaire. Please try again.",
      color: "error",
      icon: "i-heroicons-x-circle",
    });
  } finally {
    saving.value = false;
  }
}
</script>
