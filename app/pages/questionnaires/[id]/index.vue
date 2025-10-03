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
        />
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
        <div class="flex gap-3 mb-8 justify-between">
          <div class="flex gap-3">
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
              icon="i-heroicons-user-group"
            >
              Generate Groups
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              icon="i-heroicons-link"
              @click="copyStudentLink"
            >
              Copy Student Link
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              icon="i-heroicons-qr-code"
              @click="showQRCodeModal = true"
            >
              Show QR Code
            </UButton>
          </div>
          
          <!-- Print Button (Far Right) -->
          <UButton
            color="neutral"
            variant="outline"
            icon="i-heroicons-printer"
            @click="printQuestionnaire"
          >
            Print
          </UButton>
        </div>

        <!-- QR Code Modal -->
        <UModal
          v-model:open="showQRCodeModal"
          title="Share with Students"
          @after:enter="generateQRCode"
        >
          <template #body>
            <div class="space-y-6">
              <!-- QR Code Display -->
              <div class="flex flex-col items-center">
                <div class="bg-white p-6 rounded-lg border-2 border-gray-200">
                  <canvas ref="qrCanvas" class="mx-auto" />
                </div>
                <p class="mt-4 text-sm text-gray-600 text-center max-w-md">
                  Students can scan this QR code to access the questionnaire
                </p>
              </div>

              <!-- Student Link -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Direct Link
                </label>
                <div class="flex gap-2">
                  <UInput :model-value="studentLink" readonly class="flex-1" />
                  <UButton
                    variant="outline"
                    icon="i-heroicons-clipboard-document"
                    @click="copyStudentLink"
                  >
                    Copy
                  </UButton>
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <div class="flex items-center justify-end gap-3">
              <UButton
                color="neutral"
                variant="outline"
                @click="showQRCodeModal = false"
              >
                Close
              </UButton>
              <UButton
                color="primary"
                icon="i-heroicons-arrow-down-tray"
                @click="downloadQRCode"
              >
                Download QR Code
              </UButton>
            </div>
          </template>
        </UModal>

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
import QRCode from "qrcode";
import { printQuestionnaire as printQuestionnaireUtil } from "../../../../utils/print";

interface Question {
  id: number;
  question_text: string;
  question_type: string;
  trait: string | string[];
  category: string;
  weight: number;
  options?: string[];
}

interface Questionnaire {
  id: number;
  title: string;
  description: string;
  created_at: string;
  questions: Question[];
}

interface QuestionnaireResponse {
  success: boolean;
  questionnaire: Questionnaire | null;
}

const route = useRoute();
const toast = useToast();

// Use useFetch for initial data loading with better SSR support
const { data: questionnaireResponse, pending: loading } = await useFetch<QuestionnaireResponse>(
  `/api/questionnaires/${route.params.id}`,
  {
    default: (): QuestionnaireResponse => ({ success: false, questionnaire: null })
  }
);

// Compute questionnaire from the response
const questionnaire = computed(() => {
  return questionnaireResponse.value.success ? questionnaireResponse.value.questionnaire : null;
});

const showQRCodeModal = ref(false);
const qrCanvas = ref<HTMLCanvasElement | null>(null);

const studentLink = computed(
  () => `${window.location.origin}/respond/${route.params.id}`
);

// Generate QR code after modal is fully rendered
async function generateQRCode() {
  await nextTick();
  if (qrCanvas.value) {
    try {
      await QRCode.toCanvas(qrCanvas.value, studentLink.value, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      toast.add({
        title: "Error",
        description: "Failed to generate QR code",
        color: "error",
        icon: "i-heroicons-x-circle",
      });
    }
  } else {
    console.error("Canvas element not found");
  }
}

function copyStudentLink() {
  navigator.clipboard.writeText(studentLink.value);
  toast.add({
    title: "Link Copied",
    description: "Student link has been copied to clipboard!",
    color: "success",
    icon: "i-heroicons-check-circle",
  });
}

async function downloadQRCode() {
  if (!qrCanvas.value) return;

  try {
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      qrCanvas.value!.toBlob((blob) => {
        resolve(blob!);
      });
    });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `questionnaire-${route.params.id}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.add({
      title: "QR Code Downloaded",
      description: "QR code has been saved to your device",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
  } catch (error) {
    console.error("Failed to download QR code:", error);
    toast.add({
      title: "Download Failed",
      description: "Failed to download QR code",
      color: "error",
      icon: "i-heroicons-x-circle",
    });
  }
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

function printQuestionnaire() {
  printQuestionnaireUtil(questionnaire.value);
}
</script>
