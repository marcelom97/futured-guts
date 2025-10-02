<template>
  <UModal
    v-model:open="isOpen"
    :title="`${student?.name}'s Questionnaires`"
  >
    <template #body>
      <div v-if="loading" class="text-center py-8">
        <UIcon
          name="i-heroicons-arrow-path"
          class="animate-spin h-8 w-8 text-primary mx-auto"
        />
        <p class="mt-2 text-sm text-gray-600">Loading questionnaires...</p>
      </div>

      <div
        v-else-if="questionnaires.length === 0"
        class="text-center py-8"
      >
        <UIcon
          name="i-heroicons-document-text"
          class="mx-auto h-12 w-12 text-gray-400"
        />
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          No questionnaires
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          This student hasn't completed any questionnaires yet.
        </p>
      </div>

      <div v-else class="space-y-4">
        <StudentQuestionnaireCard
          v-for="questionnaire in questionnaires"
          :key="questionnaire.id"
          :questionnaire="questionnaire"
          @view-responses="$emit('viewResponses', questionnaire)"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-end">
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-x-mark"
          @click="$emit('update:modelValue', false)"
        >
          Close
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Student, StudentQuestionnaire } from '~/types/students';

interface Props {
  modelValue: boolean;
  student: Student | null;
  questionnaires: StudentQuestionnaire[];
  loading: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  viewResponses: [questionnaire: StudentQuestionnaire];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>