<template>
  <div class="min-h-screen bg-white">
    <UContainer class="py-12">
      <UButton
        :to="`/questionnaires/${route.params.id}`"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="mb-4"
      >
        Back to {{ questionnaire?.title || 'Questionnaire' }}
      </UButton>

      <!-- Modular Page Header -->
      <ResponsesPageHeader 
        title="Student Responses"
        subtitle="Review student responses to questionnaire"
      />

      <!-- Modular Filters Card -->
      <ResponsesFiltersCard 
        v-model:filters="filters"
        :trait-options="traitOptions"
        :has-active-filters="hasActiveFilters"
        @clear-filters="clearFilters"
      />

      <!-- Modular Responses Table -->
      <ResponsesTable 
        :responses="responses"
        :filtered-responses="filteredResponses"
        :loading="loading"
        @clear-filters="clearFilters"
      />
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { Response, ResponseFilters, TraitOption } from '~/types/responses';

const route = useRoute();

// Use useFetch for initial data loading with better SSR support
const { data: responsesData, pending: loading } = await useFetch<{
  success: boolean;
  responses: Response[];
}>(`/api/responses/questionnaire/${route.params.id}`, {
  default: () => ({ success: false, responses: [] })
});

// Fetch questionnaire data for the back button
const { data: questionnaireData } = await useFetch<{
  success: boolean;
  questionnaire: { id: number; title: string; description?: string; created_at: string } | null;
}>(`/api/questionnaires/${route.params.id}`, {
  default: () => ({ success: false, questionnaire: null })
});

// Compute responses from the fetched data
const responses = computed(() => {
  return responsesData.value?.success ? responsesData.value.responses || [] : [];
});

// Compute questionnaire from the fetched data
const questionnaire = computed(() => {
  return questionnaireData.value?.success ? questionnaireData.value.questionnaire : null;
});

// Filter reactive variables
const filters = ref<ResponseFilters>({
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

const traitOptions = computed((): TraitOption[] => {
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
  if (Array.isArray(traits) && traits.length > 0) {
    return traits.map(formatSingleTrait).join(", ");
  }
  return "None";
}
</script>
