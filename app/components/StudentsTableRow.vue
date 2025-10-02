<template>
  <tr class="hover:bg-gray-50">
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="flex items-center gap-3">
        <UAvatar
          :text="student.name.charAt(0).toUpperCase()"
          size="md"
        />
        <span class="text-sm font-medium text-gray-900">{{
          student.name
        }}</span>
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <span class="text-sm text-gray-900">{{ student.email }}</span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="flex items-center">
        <StudentGroupsBadge
          :count="student.group_count"
          @click="$emit('groupsClick')"
        />
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="flex items-center">
        <StudentQuestionnairesBadge
          :count="student.questionnaire_count"
          @click="$emit('questionnairesClick')"
        />
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {{ formatDate(student.created_at) }}
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { Student } from '~/types/students';

interface Props {
  student: Student;
}

defineProps<Props>();

defineEmits<{
  groupsClick: [];
  questionnairesClick: [];
}>();

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}
</script>