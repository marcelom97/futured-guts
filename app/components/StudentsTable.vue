<template>
  <UCard>
    <div v-if="loading" class="text-center py-8">
      <UIcon
        name="i-heroicons-arrow-path"
        class="animate-spin h-8 w-8 text-primary mx-auto"
      />
      <p class="mt-2 text-sm text-gray-600">Loading students...</p>
    </div>

    <div v-else-if="students.length === 0" class="text-center py-12">
      <UIcon
        name="i-heroicons-users"
        class="mx-auto h-12 w-12 text-gray-400"
      />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No students</h3>
      <p class="mt-1 text-sm text-gray-500">
        Get started by adding a student.
      </p>
      <div class="mt-6">
        <UButton icon="i-heroicons-plus" @click="$emit('addStudent')">
          Add Student
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
              Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Groups
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Questionnaires
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Added
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <StudentsTableRow
            v-for="student in students"
            :key="student.id"
            :student="student"
            @groups-click="$emit('openGroups', student)"
            @questionnaires-click="$emit('openQuestionnaires', student)"
          />
        </tbody>
      </table>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Student } from '~/types/students';

interface Props {
  students: Student[];
  loading: boolean;
}

defineProps<Props>();

defineEmits<{
  addStudent: [];
  openGroups: [student: Student];
  openQuestionnaires: [student: Student];
}>();
</script>