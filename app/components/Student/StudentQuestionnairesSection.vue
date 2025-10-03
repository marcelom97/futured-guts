<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-document-text" class="h-5 w-5 text-gray-400" />
        <h3 class="text-lg font-medium text-gray-900">Questionnaire Participation</h3>
      </div>
    </template>

    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
    </div>

    <div v-else-if="questionnaires.length === 0" class="text-center py-8">
      <UIcon
        name="i-heroicons-document-text"
        class="mx-auto h-12 w-12 text-gray-400"
      />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No questionnaires yet</h3>
      <p class="mt-1 text-sm text-gray-500">
        This student hasn't participated in any questionnaires.
      </p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="questionnaire in questionnaires"
        :key="questionnaire.id"
        class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h4 class="font-medium text-gray-900">{{ questionnaire.title }}</h4>
            <p v-if="questionnaire.description" class="text-sm text-gray-600 mt-1">
              {{ questionnaire.description }}
            </p>
            <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>{{ questionnaire.responses_count }} responses</span>
              <span v-if="questionnaire.completed_at">
                Completed {{ new Date(questionnaire.completed_at).toLocaleDateString() }}
              </span>
              <span v-else>
                Started {{ new Date(questionnaire.created_at).toLocaleDateString() }}
              </span>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <UBadge
              :color="questionnaire.completed ? 'success' : 'warning'"
              variant="subtle"
            >
              {{ questionnaire.completed ? 'Completed' : 'In Progress' }}
            </UBadge>
            
            <UButton
              :to="`/questionnaires/${questionnaire.id}/responses`"
              variant="ghost"
              size="sm"
              icon="i-heroicons-eye"
            >
              View
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface StudentQuestionnaire {
  id: number
  title: string
  description?: string
  completed: boolean
  completed_at?: string
  responses_count: number
  created_at: string
}

interface Props {
  questionnaires: StudentQuestionnaire[]
  loading: boolean
}

defineProps<Props>()
</script>