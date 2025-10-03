<template>
  <UCard class="mt-8">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-clock" class="h-5 w-5 text-gray-400" />
        <h3 class="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
    </template>

    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
    </div>

    <div v-else-if="activities.length === 0" class="text-center py-8">
      <UIcon
        name="i-heroicons-clock"
        class="mx-auto h-12 w-12 text-gray-400"
      />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
      <p class="mt-1 text-sm text-gray-500">
        This student hasn't had any recent activity.
      </p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="flex items-start gap-4 p-4 border border-gray-200 rounded-lg"
      >
        <div class="flex-shrink-0">
          <div
            :class="[
              'h-10 w-10 rounded-full flex items-center justify-center',
              activity.type === 'questionnaire' ? 'bg-blue-100' : 'bg-purple-100'
            ]"
          >
            <UIcon
              :name="activity.type === 'questionnaire' ? 'i-heroicons-document-text' : 'i-heroicons-user-group'"
              :class="[
                'h-5 w-5',
                activity.type === 'questionnaire' ? 'text-blue-600' : 'text-purple-600'
              ]"
            />
          </div>
        </div>
        
        <div class="flex-1">
          <h4 class="font-medium text-gray-900">{{ activity.title }}</h4>
          <p class="text-sm text-gray-600 mt-1">{{ activity.description }}</p>
          <p class="text-xs text-gray-400 mt-2">
            {{ formatTimeAgo(activity.timestamp) }}
          </p>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface StudentActivity {
  id: number
  type: 'questionnaire' | 'group'
  title: string
  description: string
  timestamp: string
}

interface Props {
  activities: StudentActivity[]
  loading: boolean
}

defineProps<Props>()

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = diffInMs / (1000 * 60 * 60)
  const diffInDays = diffInHours / 24

  if (diffInHours < 1) {
    return 'Less than an hour ago'
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)} days ago`
  } else {
    return date.toLocaleDateString()
  }
}
</script>