<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Personality Traits Profile</h3>
          <p class="text-sm text-gray-500">Student's cumulative trait scores across all questionnaires</p>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            :variant="chartType === 'radar' ? 'solid' : 'outline'"
            size="xs"
            @click="chartType = 'radar'"
          >
            Radar View
          </UButton>
          <UButton
            :variant="chartType === 'bar' ? 'solid' : 'outline'"
            size="xs"
            @click="chartType = 'bar'"
          >
            Bar View
          </UButton>
        </div>
      </div>
    </template>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"
      />
      <span class="ml-3 text-gray-600">Loading traits data...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500 mb-4" />
      <p class="text-red-600 mb-2">Failed to load traits data</p>
      <p class="text-gray-500 text-sm">{{ error }}</p>
      <UButton 
        class="mt-4" 
        size="sm"
        @click="fetchTraitsData"
      >
        Retry
      </UButton>
    </div>

    <!-- No Data State -->
    <div v-else-if="!traitsData || traitsData.length === 0" class="text-center py-8">
      <UIcon name="i-heroicons-chart-bar-square" class="w-12 h-12 text-gray-400 mb-4" />
      <p class="text-gray-600 mb-2">No traits data available</p>
      <p class="text-gray-500 text-sm">This student hasn't completed any questionnaires yet</p>
    </div>

    <!-- Chart Container -->
    <div v-else class="space-y-6">
      <!-- Chart -->
      <div class="chart-wrapper" style="position: relative; height: 400px;">
        <Radar
          v-if="chartType === 'radar'"
          :data="radarChartData"
          :options="radarChartOptions"
        />
        <Bar
          v-else-if="chartType === 'bar'"
          :data="barChartData"
          :options="barChartOptions"
        />
      </div>

      <!-- Traits Summary -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="category in categoryStats"
          :key="category.name"
          class="text-center p-4 bg-gray-50 rounded-lg"
        >
          <div class="text-lg font-bold" :class="category.color">
            {{ category.avgScore }}
          </div>
          <div class="text-sm text-gray-600">{{ category.name }}</div>
          <div class="text-xs text-gray-500">{{ category.count }} traits</div>
        </div>
      </div>

      <!-- Top Traits -->
      <div class="space-y-4">
        <h4 class="text-md font-semibold text-gray-900">Strongest Traits</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="trait in topTraits"
            :key="trait.trait"
            class="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
          >
            <div class="flex-1">
              <div class="font-medium text-gray-900">{{ formatTraitName(trait.trait) }}</div>
              <div class="text-sm text-gray-600">
                <UBadge :color="getCategoryColor(trait.category)" size="xs" class="mr-2">
                  {{ formatCategory(trait.category) }}
                </UBadge>
                {{ trait.responseCount }} responses
              </div>
            </div>
            <div class="text-right">
              <div class="text-xl font-bold text-blue-600">{{ trait.avgScore }}</div>
              <div class="text-xs text-gray-500">out of 5</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Questionnaires Breakdown -->
      <div class="space-y-4">
        <h4 class="text-md font-semibold text-gray-900">Questionnaires Completed</h4>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="questionnaire in uniqueQuestionnaires"
            :key="questionnaire"
            color="neutral"
            variant="soft"
          >
            {{ questionnaire }}
          </UBadge>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js'
import { Bar, Radar } from 'vue-chartjs'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
)

interface StudentTraitData {
  trait: string
  category: string
  avgScore: number
  responseCount: number
  questionnaires: string[]
}

interface Props {
  studentId: number | string
}

const props = defineProps<Props>()

// Reactive state
const loading = ref(true)
const error = ref<string | null>(null)
const traitsData = ref<StudentTraitData[]>([])
const chartType = ref<'radar' | 'bar'>('radar')

// Chart data and options
const radarChartData = computed(() => {
  if (!traitsData.value.length) return { labels: [], datasets: [] }

  const labels = traitsData.value.map(trait => formatTraitName(trait.trait))
  const scores = traitsData.value.map(trait => trait.avgScore)

  return {
    labels,
    datasets: [
      {
        label: 'Trait Scores',
        data: scores,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ]
  }
})

const radarChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    r: {
      angleLines: {
        display: true,
        color: 'rgba(0, 0, 0, 0.1)',
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      pointLabels: {
        font: {
          size: 12,
        },
        color: '#374151',
      },
      ticks: {
        display: true,
        stepSize: 1,
        color: '#9CA3AF',
        font: {
          size: 10,
        },
      },
      suggestedMin: 0,
      suggestedMax: 5,
      beginAtZero: true,
    },
  },
}))

const barChartData = computed(() => {
  if (!traitsData.value.length) return { labels: [], datasets: [] }

  const labels = traitsData.value.map(trait => formatTraitName(trait.trait))
  const scores = traitsData.value.map(trait => trait.avgScore)
  
  // Color bars based on category
  const colors = traitsData.value.map(trait => {
    const colorMap: Record<string, string> = {
      behavioral: 'rgba(59, 130, 246, 0.8)',
      hard_skill: 'rgba(16, 185, 129, 0.8)',
      soft_skill: 'rgba(245, 158, 11, 0.8)',
      technical: 'rgba(239, 68, 68, 0.8)',
      personality: 'rgba(139, 92, 246, 0.8)',
    }
    return colorMap[trait.category] || 'rgba(107, 114, 128, 0.8)'
  })

  return {
    labels,
    datasets: [
      {
        label: 'Trait Scores',
        data: scores,
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
      },
    ]
  }
})

const barChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 5,
      title: {
        display: true,
        text: 'Score (1-5)',
      },
    },
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 45,
      },
    },
  },
}))

// Computed statistics
const categoryStats = computed(() => {
  if (!traitsData.value.length) return []

  const categories: Record<string, { scores: number[], count: number }> = {}
  
  traitsData.value.forEach(trait => {
    if (!categories[trait.category]) {
      categories[trait.category] = { scores: [], count: 0 }
    }
    categories[trait.category]!.scores.push(trait.avgScore)
    categories[trait.category]!.count++
  })

  return Object.entries(categories).map(([category, data]) => ({
    name: formatCategory(category),
    avgScore: (data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length).toFixed(1),
    count: data.count,
    color: getCategoryTextColor(category),
  }))
})

const topTraits = computed(() => {
  return [...traitsData.value]
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 6)
})

const uniqueQuestionnaires = computed(() => {
  const questionnaires = new Set<string>()
  traitsData.value.forEach(trait => {
    trait.questionnaires.forEach(q => questionnaires.add(q))
  })
  return Array.from(questionnaires)
})

// Utility functions
function formatTraitName(trait: string): string {
  return trait
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    behavioral: 'Behavioral',
    hard_skill: 'Hard Skill',
    soft_skill: 'Soft Skill',
    technical: 'Technical',
    personality: 'Personality',
  }
  return categoryMap[category] || category
}

function getCategoryColor(category: string): 'primary' | 'success' | 'info' | 'warning' | 'error' {
  const colorMap: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'error'> = {
    behavioral: 'primary',
    hard_skill: 'success',
    soft_skill: 'info',
    technical: 'warning',
    personality: 'error',
  }
  return colorMap[category] || 'primary'
}

function getCategoryTextColor(category: string): string {
  const colorMap: Record<string, string> = {
    behavioral: 'text-blue-600',
    hard_skill: 'text-green-600',
    soft_skill: 'text-cyan-600',
    technical: 'text-orange-600',
    personality: 'text-purple-600',
  }
  return colorMap[category] || 'text-gray-600'
}

// Fetch traits data
async function fetchTraitsData() {
  try {
    loading.value = true
    error.value = null

    const response = await $fetch<{
      success: boolean
      traitsData: StudentTraitData[]
    }>(`/api/students/${props.studentId}/traits`)

    if (response.success) {
      traitsData.value = response.traitsData
    } else {
      throw new Error('Failed to fetch student traits data')
    }
  } catch (err) {
    console.error('Error fetching student traits data:', err)
    error.value = err instanceof Error ? err.message : 'Unknown error occurred'
  } finally {
    loading.value = false
  }
}

// Initialize data on mount
onMounted(() => {
  fetchTraitsData()
})

// Watch for student ID changes
watch(() => props.studentId, () => {
  fetchTraitsData()
})
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 400px;
}
</style>