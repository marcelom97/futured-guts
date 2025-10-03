<template>
  <div class="traits-chart-container">
    <UCard
      :ui="{
        body: { padding: 'p-6' },
        header: { padding: 'px-6 py-4' },
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Traits Analysis</h3>
            <p class="text-sm text-gray-500">Distribution of traits across responses</p>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              :variant="chartType === 'radar' ? 'solid' : 'outline'"
              size="xs"
              @click="chartType = 'radar'"
            >
              Radar Chart
            </UButton>
            <UButton
              :variant="chartType === 'pie' ? 'solid' : 'outline'"
              size="xs"
              @click="chartType = 'pie'"
            >
              Pie Chart
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
        <p class="text-gray-500 text-sm">Complete some questionnaire responses to see trait analysis</p>
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
          <Pie
            v-else-if="chartType === 'pie'"
            :data="pieChartData"
            :options="pieChartOptions"
          />
        </div>

        <!-- Summary Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard
            v-for="stat in summaryStats"
            :key="stat.label"
            class="p-4"
          >
            <div class="text-center">
              <div class="text-2xl font-bold" :class="stat.color">{{ stat.value }}</div>
              <div class="text-sm text-gray-600">{{ stat.label }}</div>
            </div>
          </UCard>
        </div>

        <!-- Traits Breakdown -->
        <div class="space-y-4">
          <h4 class="text-md font-semibold text-gray-900">Detailed Breakdown</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UCard
              v-for="trait in traitsData"
              :key="trait.trait"
              class="p-4"
            >
              <div class="flex items-center justify-between mb-2">
                <h5 class="font-medium text-gray-900">{{ formatTraitName(trait.trait) }}</h5>
                <UBadge :color="getCategoryColor(trait.category)" size="xs">
                  {{ formatCategory(trait.category) }}
                </UBadge>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Responses:</span>
                  <span class="font-medium">{{ trait.responseCount }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Average Score:</span>
                  <span class="font-medium">{{ trait.avgScore.toFixed(2) }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-blue-600 h-2 rounded-full"
                    :style="{ width: `${(trait.avgScore / 5) * 100}%` }"
                  />
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </UCard>
  </div>
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
  ArcElement,
} from 'chart.js'
import { Bar, Radar, Pie } from 'vue-chartjs'

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
  Filler,
  ArcElement
)

interface TraitAnalytics {
  trait: string
  category: string
  responseCount: number
  avgScore: number
  distribution: Record<string, number>
}

interface Props {
  questionnaireId: number | string
}

const props = defineProps<Props>()

// Reactive state
const loading = ref(true)
const error = ref<string | null>(null)
const traitsData = ref<TraitAnalytics[]>([])
const chartType = ref< 'radar' | 'pie'>('radar')

// Chart data and options
const radarChartData = computed(() => {
  if (!traitsData.value.length) return { labels: [], datasets: [] }

  const labels = traitsData.value.map(trait => formatTraitName(trait.trait))
  const avgScores = traitsData.value.map(trait => trait.avgScore)

  return {
    labels,
    datasets: [
      {
        label: 'Average Scores',
        data: avgScores,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
      },
    ]
  }
})

const radarChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Traits Analysis - Radar View',
    },
  },
  scales: {
    r: {
      angleLines: {
        display: true,
      },
      suggestedMin: 0,
      suggestedMax: 5,
      title: {
        display: true,
        text: 'Score (1-5)',
      },
    },
  },
}))

const pieChartData = computed(() => {
  if (!traitsData.value.length) return { labels: [], datasets: [] }

  const labels = traitsData.value.map(trait => formatTraitName(trait.trait))
  const responseCounts = traitsData.value.map(trait => trait.responseCount)
  
  const colors = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(14, 165, 233, 0.8)',
    'rgba(34, 197, 94, 0.8)',
  ]

  return {
    labels,
    datasets: [
      {
        data: responseCounts,
        backgroundColor: colors.slice(0, responseCounts.length),
        borderColor: colors.slice(0, responseCounts.length).map(color => 
          color.replace('0.8', '1')
        ),
        borderWidth: 1,
      },
    ]
  }
})

const pieChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
    },
    title: {
      display: true,
      text: 'Response Distribution by Trait',
    },
  },
}))

// Summary statistics
const summaryStats = computed(() => {
  if (!traitsData.value.length) return []

  const totalResponses = traitsData.value.reduce((sum, trait) => sum + trait.responseCount, 0)
  const totalTraits = traitsData.value.length
  const avgOverallScore = traitsData.value.reduce((sum, trait) => sum + trait.avgScore, 0) / totalTraits

  return [
    {
      label: 'Total Traits',
      value: totalTraits,
      color: 'text-blue-600',
    },
    {
      label: 'Total Responses',
      value: totalResponses,
      color: 'text-green-600',
    },
    {
      label: 'Overall Avg Score',
      value: avgOverallScore.toFixed(2),
      color: 'text-purple-600',
    },
  ]
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

// Fetch traits data
async function fetchTraitsData() {
  try {
    loading.value = true
    error.value = null

    const response = await $fetch<{
      success: boolean
      traitsData: TraitAnalytics[]
    }>(`/api/questionnaires/${props.questionnaireId}/traits`)

    if (response.success) {
      traitsData.value = response.traitsData
    } else {
      throw new Error('Failed to fetch traits data')
    }
  } catch (err) {
    console.error('Error fetching traits data:', err)
    error.value = err instanceof Error ? err.message : 'Unknown error occurred'
  } finally {
    loading.value = false
  }
}

// Initialize data on mount
onMounted(() => {
  fetchTraitsData()
})

// Watch for questionnaire ID changes
watch(() => props.questionnaireId, () => {
  fetchTraitsData()
})
</script>

<style scoped>
.traits-chart-container {
  width: 100%;
}

.chart-wrapper {
  width: 100%;
  height: 400px;
}
</style>