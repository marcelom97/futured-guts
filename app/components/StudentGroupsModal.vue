<template>
  <UModal
    v-model:open="isOpen"
    :title="`${student?.name}'s Groups`"
  >
    <template #body>
      <div v-if="loading" class="text-center py-8">
        <UIcon
          name="i-heroicons-arrow-path"
          class="animate-spin h-8 w-8 text-primary mx-auto"
        />
        <p class="mt-2 text-sm text-gray-600">Loading groups...</p>
      </div>

      <div v-else-if="groups.length === 0" class="text-center py-8">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No groups</h3>
        <p class="mt-1 text-sm text-gray-500">
          This student is not a member of any groups yet.
        </p>
      </div>

      <div v-else class="space-y-4">
        <StudentGroupCard
          v-for="group in groups"
          :key="group.id"
          :group="group"
          @view-group="$emit('viewGroup', group)"
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
import type { Student, StudentGroup } from '~/types/students';

interface Props {
  modelValue: boolean;
  student: Student | null;
  groups: StudentGroup[];
  loading: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  viewGroup: [group: StudentGroup];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>