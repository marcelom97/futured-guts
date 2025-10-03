<template>
  <UModal
    v-model:open="isOpen"
    :title="questionnaire?.title"
  >
    <template #body>
      <div v-if="questionnaire" class="space-y-4">
        <div>
          <h4 class="font-medium text-gray-900 mb-2">Description</h4>
          <p class="text-gray-600">{{ questionnaire.description }}</p>
        </div>
        <div>
          <h4 class="font-medium text-gray-900 mb-2">Created</h4>
          <p class="text-gray-600">
            {{ formatDate(questionnaire.created_at) }}
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex gap-2">
        <UButton
          :to="`/questionnaires/${questionnaire?.id}`"
          color="primary"
          size="sm"
          icon="i-heroicons-eye"
        >
          View Details
        </UButton>
        <UButton
          :to="`/questionnaires/${questionnaire?.id}/responses`"
          variant="outline"
          size="sm"
          icon="i-heroicons-document-chart-bar"
        >
          View Responses
        </UButton>
        <UButton
          :to="`/questionnaires/${questionnaire?.id}/groups`"
          variant="outline"
          size="sm"
          icon="i-heroicons-users"
        >
          Generate Groups
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Questionnaire } from '~/types/dashboard';

interface Props {
  questionnaire: Questionnaire | null;
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}
</script>