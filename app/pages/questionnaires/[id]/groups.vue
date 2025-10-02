<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <UButton
        :to="`/questionnaires/${route.params.id}`"
        color="gray"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="mb-4"
      >
        Back to Questionnaire
      </UButton>

      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Student Groups</h1>
        <p class="mt-2 text-gray-600">
          AI-generated student groupings based on questionnaire responses
        </p>
      </div>

      <!-- Generation Controls -->
      <UCard class="mb-8" v-if="groups.length === 0 || showControls">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Generate New Groups</h2>
            <UButton
              v-if="groups.length > 0"
              @click="showControls = false"
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
            >
              Cancel
            </UButton>
          </div>
        </template>

        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Number of Groups
              </label>
              <UInput
                v-model.number="numGroups"
                type="number"
                min="2"
                max="10"
                size="lg"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Grouping Strategy
              </label>
              <USelectMenu
                v-model="groupingStrategy"
                :options="strategies"
                size="lg"
              />
            </div>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex">
              <svg
                class="h-5 w-5 text-blue-400 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="ml-3">
                <p class="text-sm text-blue-700">
                  <strong>{{ getCurrentStrategyInfo().name }}:</strong>
                  {{ getCurrentStrategyInfo().description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              @click="generateGroups"
              :loading="generating"
              color="primary"
              size="lg"
              icon="i-heroicons-sparkles"
            >
              Generate Groups with AI
            </UButton>
          </div>
        </template>
      </UCard>

      <!-- Existing Groups -->
      <div v-if="groups.length > 0 && !showControls">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900">Current Groups</h2>
            <p v-if="balanceScore" class="mt-1 text-sm text-gray-600">
              Balance Score: {{ balanceScore }}/100
            </p>
          </div>
          <UButton
            @click="showControls = true"
            color="primary"
            variant="outline"
            icon="i-heroicons-arrow-path"
          >
            Regenerate Groups
          </UButton>
        </div>

        <div v-if="diversityExplanation" class="mb-6">
          <UCard>
            <div class="flex items-start gap-3">
              <svg
                class="h-6 w-6 text-purple-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">AI Analysis</h3>
                <p class="text-gray-600">{{ diversityExplanation }}</p>
              </div>
            </div>
          </UCard>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard
            v-for="group in groups"
            :key="group.id"
            :ui="{ body: { padding: 'p-0 sm:p-0' } }"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ group.name }}
                </h3>
                <span
                  class="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
                >
                  {{ group.members?.length || 0 }} students
                </span>
              </div>
            </template>

            <div class="divide-y divide-gray-200">
              <div
                v-for="member in group.members"
                :key="member.id"
                class="px-6 py-3 hover:bg-gray-50"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm"
                  >
                    {{ member.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ member.name }}
                    </p>
                    <p class="text-xs text-gray-500 truncate">
                      {{ member.email }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <template #footer>
              <UButton
                @click="editGroup(group)"
                color="gray"
                variant="ghost"
                size="sm"
                block
                icon="i-heroicons-pencil"
              >
                Edit Group
              </UButton>
            </template>
          </UCard>
        </div>
      </div>

      <div v-else-if="!showControls" class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No groups yet</h3>
        <p class="mt-1 text-sm text-gray-500">
          Generate your first set of student groups using AI.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const groups = ref<any[]>([]);
const generating = ref(false);
const showControls = ref(false);
const numGroups = ref(4);
const groupingStrategy = ref("balanced");
const balanceScore = ref<number | null>(null);
const diversityExplanation = ref<string>("");

const strategies = [
  { label: "Balanced", value: "balanced" },
  { label: "Homogeneous", value: "homogeneous" },
  { label: "Diverse", value: "diverse" },
];

const strategyInfo = {
  balanced: {
    name: "Balanced Groups",
    description:
      "Mix students with different strengths to create well-rounded teams. Each group will have a diverse set of skills and personalities.",
  },
  homogeneous: {
    name: "Homogeneous Groups",
    description:
      "Group students with similar skill levels together. This creates teams where members have comparable abilities.",
  },
  diverse: {
    name: "Maximum Diversity",
    description:
      "Maximize diversity across all measured traits. Each group will have the widest range of different characteristics.",
  },
};

function getCurrentStrategyInfo() {
  return strategyInfo[groupingStrategy.value as keyof typeof strategyInfo];
}

onMounted(async () => {
  await loadGroups();
  if (groups.value.length === 0) {
    showControls.value = true;
  }
});

async function loadGroups() {
  try {
    const response = await $fetch(
      `/api/groups/questionnaire/${route.params.id}`
    );
    if (response.success) {
      groups.value = response.groups;
    }
  } catch (error) {
    console.error("Failed to load groups:", error);
  }
}

async function generateGroups() {
  generating.value = true;
  try {
    const response = await $fetch("/api/ai/generate-groups", {
      method: "POST",
      body: {
        questionnaire_id: route.params.id,
        num_groups: numGroups.value,
        grouping_strategy: groupingStrategy.value,
      },
    });

    if (response.success) {
      balanceScore.value = response.balance_score;
      diversityExplanation.value = response.diversity_explanation;
      await loadGroups();
      showControls.value = false;
    }
  } catch (error) {
    console.error("Failed to generate groups:", error);
    alert(
      "Failed to generate groups. Please ensure students have submitted responses."
    );
  } finally {
    generating.value = false;
  }
}

function editGroup(group: any) {
  // Implement edit functionality
  alert(`Edit functionality for ${group.name} - Coming soon!`);
}
</script>
