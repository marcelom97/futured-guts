<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <UCard>
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-document-text" class="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Total Questionnaires</p>
          <p class="text-2xl font-bold text-gray-900">{{ stats.total_questionnaires }}</p>
        </div>
      </div>
    </UCard>

    <UCard>
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-check-circle" class="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Completed</p>
          <p class="text-2xl font-bold text-gray-900">{{ stats.completed_questionnaires }}</p>
        </div>
      </div>
    </UCard>

    <UCard>
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-user-group" class="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Groups</p>
          <p class="text-2xl font-bold text-gray-900">{{ stats.total_groups }}</p>
        </div>
      </div>
    </UCard>

    <UCard>
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-chat-bubble-left-right" class="h-6 w-6 text-orange-600" />
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Total Responses</p>
          <p class="text-2xl font-bold text-gray-900">{{ stats.total_responses }}</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
interface StudentStats {
  total_questionnaires: number
  completed_questionnaires: number
  total_groups: number
  total_responses: number
}

interface Props {
  stats: StudentStats
}

defineProps<Props>()
</script>