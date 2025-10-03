<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-user-group" class="h-5 w-5 text-gray-400" />
        <h3 class="text-lg font-medium text-gray-900">Group Memberships</h3>
      </div>
    </template>

    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
    </div>

    <div v-else-if="groups.length === 0" class="text-center py-8">
      <UIcon
        name="i-heroicons-user-group"
        class="mx-auto h-12 w-12 text-gray-400"
      />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No groups yet</h3>
      <p class="mt-1 text-sm text-gray-500">
        This student hasn't been assigned to any groups.
      </p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="group in groups"
        :key="group.id"
        class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h4 class="font-medium text-gray-900">{{ group.name }}</h4>
            <p class="text-sm text-gray-600 mt-1">
              From questionnaire: {{ group.questionnaire_title }}
            </p>
            <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>{{ group.members_count }} members</span>
              <span>
                Created {{ new Date(group.created_at).toLocaleDateString() }}
              </span>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <UBadge
              color="primary"
              variant="subtle"
            >
              Active
            </UBadge>
            
            <UButton
              :to="`/questionnaires/${group.questionnaire_id}/groups`"
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
interface StudentGroup {
  id: number
  name: string
  questionnaire_title: string
  questionnaire_id: number
  members_count: number
  created_at: string
}

interface Props {
  groups: StudentGroup[]
  loading: boolean
}

defineProps<Props>()
</script>