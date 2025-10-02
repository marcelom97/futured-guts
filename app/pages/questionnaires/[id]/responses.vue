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

      <!-- Filters Section -->
      <UCard class="mb-6">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-funnel" class="h-5 w-5 text-gray-400" />
            <h3 class="text-lg font-medium text-gray-900">Filters</h3>
            <UButton
              v-if="hasActiveFilters"
              variant="ghost"
              size="xs"
              icon="i-heroicons-x-mark"
              @click="clearFilters"
            >
              Clear All
            </UButton>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Student Name Filter -->
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <UIcon name="i-heroicons-user" class="h-4 w-4" />
              Student Name
            </label>
            <UInput
              v-model="filters.studentName"
              placeholder="Search by student name..."
              class="w-full"
            />
          </div>

          <!-- Question Filter -->
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <UIcon name="i-heroicons-document-text" class="h-4 w-4" />
              Question
            </label>
            <UInput
              v-model="filters.question"
              placeholder="Search by question text..."
              class="w-full"
            />
          </div>

          <!-- Trait Filter -->
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <UIcon name="i-heroicons-tag" class="h-4 w-4" />
              Trait
            </label>
            <USelectMenu
              v-model="filters.trait"
              :options="traitOptions"
              placeholder="Select trait..."
              class="w-full"
            />
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Responses</h3>
            <div v-if="!loading && responses.length > 0" class="text-sm text-gray-500">
              Showing {{ filteredResponses.length }} of {{ responses.length }} responses
            </div>
          </div>
        </template>

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

        <div v-else-if="filteredResponses.length === 0" class="text-center py-12">
          <UIcon
            name="i-heroicons-funnel"
            class="mx-auto h-12 w-12 text-gray-400"
          />
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            No responses match your filters
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Try adjusting your filter criteria to see more results.
          </p>
          <div class="mt-4">
            <UButton
              variant="outline"
              size="sm"
              icon="i-heroicons-x-mark"
              @click="clearFilters"
            >
              Clear Filters
            </UButton>
          </div>
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
                v-for="response in filteredResponses"
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
interface Response {
  id: number;
  student_name: string;
  question_text: string;
  trait: string;
  category: string;
  response_value: string;
  created_at: string;
}

interface Filters {
  studentName: string;
  question: string;
  trait: string;
}

const route = useRoute();
const responses = ref<Response[]>([]);
const loading = ref(true);

// Filter reactive variables
const filters = ref<Filters>({
  studentName: '',
  question: '',
  trait: ''
});

// Computed properties for filtering
const filteredResponses = computed(() => {
  let filtered = responses.value;

  // Filter by student name
  if (filters.value.studentName) {
    filtered = filtered.filter(response => 
      response.student_name.toLowerCase().includes(filters.value.studentName.toLowerCase())
    );
  }

  // Filter by question
  if (filters.value.question) {
    filtered = filtered.filter(response => 
      response.question_text.toLowerCase().includes(filters.value.question.toLowerCase())
    );
  }

  // Filter by trait
  if (filters.value.trait) {
    filtered = filtered.filter(response => 
      response.trait === filters.value.trait
    );
  }

  return filtered;
});

const hasActiveFilters = computed(() => {
  return filters.value.studentName !== '' || 
         filters.value.question !== '' || 
         filters.value.trait !== '';
});

const traitOptions = computed(() => {
  const uniqueTraits = [...new Set(responses.value.map(r => r.trait))];
  return [
    { label: 'All Traits', value: '' },
    ...uniqueTraits.map(trait => ({
      label: formatTraits(trait),
      value: trait
    }))
  ];
});

function clearFilters() {
  filters.value = {
    studentName: '',
    question: '',
    trait: ''
  };
}

onMounted(async () => {
  try {
    const response = await $fetch(
      `/api/responses/questionnaire/${route.params.id}`
    );
    if (response.success) {
      responses.value = response.responses || [];
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
