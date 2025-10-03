<template>
  <li
    class="px-6 py-4 hover:bg-gray-50 cursor-pointer transition"
    @click="$emit('click', questionnaire)"
  >
    <div class="flex items-center justify-between gap-6">
      <!-- Left Section: Questionnaire Info -->
      <div class="flex-shrink-0">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-document-text" class="h-5 w-5 text-gray-400" />
          <h3 class="text-lg font-medium text-gray-900">{{ questionnaire.title }}</h3>
        </div>
        <div class="flex items-center gap-1 mt-1">
          <UIcon name="i-heroicons-calendar" class="h-3 w-3 text-gray-400" />
          <p class="text-xs text-gray-400">
            Created {{ formatDate(questionnaire.created_at) }}
          </p>
        </div>
      </div>

      <!-- Middle Section: Progress Info -->
      <div class="flex-1 max-w-xs">
        <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>{{ questionnaire.responses_count || 0 }} students responded</span>
          <span v-if="questionnaire.total_students && questionnaire.total_students > 0">{{ getProgressPercentage() }}%</span>
        </div>
        
        <!-- Compact Progress Bar (only show if we have total students) -->
        <div v-if="questionnaire.total_students && questionnaire.total_students > 0" class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-blue-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${getProgressPercentage()}%` }"
          />
        </div>
        <!-- Activity indicator when no total student count -->
        <div v-else-if="questionnaire.responses_count && questionnaire.responses_count > 0" class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-green-500 h-2 rounded-full w-full animate-pulse" />
        </div>
        
        <div v-if="questionnaire.responses_count && questionnaire.responses_count > 0" class="text-xs text-gray-400 mt-1 text-center">
          Last response {{ formatRelativeTime(questionnaire.last_response_at) }}
        </div>
      </div>

      <!-- Right Section: Action Buttons -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <UButton
          :to="`/questionnaires/${questionnaire.id}/responses`"
          variant="ghost"
          size="sm"
          icon="i-heroicons-document-chart-bar"
          @click.stop
        >
          View Responses
        </UButton>
        <UButton
          :to="`/questionnaires/${questionnaire.id}/groups`"
          size="sm"
          icon="i-heroicons-users"
          @click.stop
        >
          Generate Groups
        </UButton>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
// Extended Questionnaire interface with progress information
interface Questionnaire {
  id: number;
  teacher_id: number;
  title: string;
  description?: string;
  created_at: string;
  responses_count?: number;
  total_students?: number;
  last_response_at?: string;
}

interface Props {
  questionnaire: Questionnaire;
}

const props = defineProps<Props>();
defineEmits<{
  click: [questionnaire: Questionnaire];
}>();

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

function getProgressPercentage(): number {
  const responsesCount = props.questionnaire.responses_count || 0;
  const totalStudents = props.questionnaire.total_students || 0;
  
  if (totalStudents === 0) return 0;
  return Math.round((responsesCount / totalStudents) * 100);
}

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  if (diffInHours < 1) {
    return 'just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)}d ago`;
  } else {
    return formatDate(dateString);
  }
}
</script>