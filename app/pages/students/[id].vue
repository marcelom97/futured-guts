<template>
  <div class="min-h-screen bg-white">
    <UContainer class="py-12">
      <UButton
        to="/students"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="mb-4"
      >
        Back to Students
      </UButton>

      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"
        />
      </div>

      <div v-else-if="student">
        <!-- Student Header -->
        <StudentDetailHeader :student="student" />

        <!-- Statistics Cards -->
        <StudentStatsCards :stats="studentStats" />

        <!-- Participation Sections -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <!-- Questionnaires Participation -->
          <StudentQuestionnairesSection 
            :questionnaires="studentQuestionnaires"
            :loading="loadingQuestionnaires"
          />

          <!-- Groups Participation -->
          <StudentGroupsSection 
            :groups="studentGroups"
            :loading="loadingGroups"
          />
        </div>

        <!-- Traits Analysis -->
        <div v-if="student" class="mt-8">
          <StudentTraitsChart :student-id="student.id" />
        </div>

        <!-- Recent Activity -->
        <StudentActivitySection 
          :activities="recentActivity"
          :loading="loadingActivity"
        />
      </div>

      <div v-else class="text-center py-12">
        <UIcon
          name="i-heroicons-user-circle"
          class="mx-auto h-12 w-12 text-gray-400"
        />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Student not found</h3>
        <p class="mt-1 text-sm text-gray-500">
          The requested student could not be found.
        </p>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
interface Student {
  id: number
  name: string
  email: string
  teacher_id: number
  created_at: string
}

interface StudentQuestionnaire {
  id: number
  title: string
  description?: string
  total_questions: number
  answered_questions: number
  completion_percentage: number
  created_at: string
}

interface StudentGroup {
  id: number
  name: string
  questionnaire_title: string
  questionnaire_id: number
  members_count: number
  created_at: string
}

interface StudentActivity {
  id: number
  type: 'questionnaire' | 'group'
  title: string
  description: string
  timestamp: string
}

interface StudentStats {
  total_questionnaires: number
  completed_questionnaires: number
  total_groups: number
  total_responses: number
}

const route = useRoute()

// Fetch student data
const { data: studentResponse, pending: loading } = await useFetch<{
  success: boolean
  student: Student | null
}>(`/api/students/${route.params.id}`, {
  default: () => ({ success: false, student: null })
})

// Fetch student questionnaires
const { data: questionnairesResponse, pending: loadingQuestionnaires } = await useFetch<{
  success: boolean
  questionnaires: StudentQuestionnaire[]
}>(`/api/students/${route.params.id}/questionnaires`, {
  default: () => ({ success: false, questionnaires: [] })
})

// Fetch student groups
const { data: groupsResponse, pending: loadingGroups } = await useFetch<{
  success: boolean
  groups: StudentGroup[]
}>(`/api/students/${route.params.id}/groups`, {
  default: () => ({ success: false, groups: [] })
})

// Fetch recent activity
const { data: activityResponse, pending: loadingActivity } = await useFetch<{
  success: boolean
  activities: StudentActivity[]
}>(`/api/students/${route.params.id}/activity`, {
  default: () => ({ success: false, activities: [] })
})

// Computed properties
const student = computed(() => {
  return studentResponse.value?.success ? studentResponse.value.student : null
})

const studentQuestionnaires = computed(() => {
  return questionnairesResponse.value?.success ? questionnairesResponse.value.questionnaires : []
})

const studentGroups = computed(() => {
  return groupsResponse.value?.success ? groupsResponse.value.groups : []
})

const recentActivity = computed(() => {
  return activityResponse.value?.success ? activityResponse.value.activities : []
})

const studentStats = computed((): StudentStats => {
  const questionnaires = studentQuestionnaires.value
  return {
    total_questionnaires: questionnaires.length,
    completed_questionnaires: questionnaires.filter(q => q.completion_percentage === 100).length,
    total_groups: studentGroups.value.length,
    total_responses: questionnaires.reduce((sum, q) => sum + q.answered_questions, 0)
  }
})

// SEO
useSeoMeta({
  title: `${student.value?.name || 'Student'} - Details`,
  description: `View detailed information about ${student.value?.name || 'student'} including questionnaire participation and group memberships.`
})
</script>