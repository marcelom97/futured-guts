<template>
  <div class="min-h-screen bg-white">
    <UContainer class="py-12">
      <UButton
        :to="`/questionnaires/${route.params.id}`"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="mb-4"
      >
        Back to {{ 'Questionnaire '+questionnaire?.title || 'Questionnaire' }}
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
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark"
            >
              Cancel
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row gap-4 items-end">
            <div class="flex-shrink-0">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Number of Groups
              </label>
              <UInput
                v-model.number="numGroups"
                type="number"
                min="2"
                max="10"
                size="lg"
                class="w-32"
              />
            </div>

            <div class="flex-shrink-0">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Grouping Strategy
              </label>
              <USelect
                v-model="groupingStrategy"
                :items="strategies"
                size="lg"
                class="w-48"
              />
            </div>
          </div>

          <UAlert
            color="primary"
            variant="subtle"
            icon="i-heroicons-information-circle"
            :title="getCurrentStrategyInfo().name"
            :description="getCurrentStrategyInfo().description"
          />
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

        <UAlert
          v-if="diversityExplanation"
          color="info"
          variant="subtle"
          icon="i-heroicons-chart-bar"
          title="AI Analysis"
          :description="diversityExplanation"
          class="mb-6"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard v-for="group in groups" :key="group.id">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ group.name }}
                </h3>
                <UBadge color="primary" variant="subtle">
                  {{ group.members?.length || 0 }} students
                </UBadge>
              </div>
            </template>

            <div class="divide-y divide-gray-200">
              <div
                v-for="member in group.members"
                :key="member.id"
                class="px-6 py-3 hover:bg-gray-50"
              >
                <div class="flex items-center gap-3">
                  <UAvatar
                    :text="member.name.charAt(0).toUpperCase()"
                    size="sm"
                  />
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
                color="neutral"
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
        <UIcon
          name="i-heroicons-user-group"
          class="mx-auto h-12 w-12 text-gray-400"
        />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No groups yet</h3>
        <p class="mt-1 text-sm text-gray-500">
          Generate your first set of student groups using AI.
        </p>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type {
  Group,
  GenerateGroupsResponse,
  GetGroupsResponse,
} from "../../../../types";

const route = useRoute();
const toast = useToast();

// Use useFetch for initial data loading
const { data: groupsResponse, refresh: _refreshGroups } = await useFetch<GetGroupsResponse>(
  `/api/groups/questionnaire/${route.params.id}`,
  {
    default: (): GetGroupsResponse => ({ 
      success: false, 
      groups: [], 
      balance_score: null, 
      diversity_explanation: "" 
    })
  }
);

// Compute derived state from the response
const groups = computed(() => {
  return groupsResponse.value.success ? groupsResponse.value.groups : [];
});

const balanceScore = computed(() => {
  return groupsResponse.value.success ? groupsResponse.value.balance_score : null;
});

const diversityExplanation = computed(() => {
  return groupsResponse.value.success ? groupsResponse.value.diversity_explanation || "" : "";
});

// Fetch questionnaire data for the back button
const { data: questionnaireData } = await useFetch<{
  success: boolean;
  questionnaire: { id: number; title: string; description?: string; created_at: string } | null;
}>(`/api/questionnaires/${route.params.id}`, {
  default: () => ({ success: false, questionnaire: null })
});

// Compute questionnaire from the fetched data
const questionnaire = computed(() => {
  return questionnaireData.value?.success ? questionnaireData.value.questionnaire : null;
});


const generating = ref(false);
const showControls = ref(false);
const numGroups = ref(4);
const groupingStrategy = ref("balanced");

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

// Set show controls based on groups length
onMounted(() => {
  if (groups.value.length === 0) {
    showControls.value = true;
  }
});

async function generateGroups() {
  generating.value = true;
  try {
    const { data: response } = await useLazyFetch<GenerateGroupsResponse>(
      "/api/ai/generate-groups",
      {
        method: "POST",
        body: {
          questionnaire_id: route.params.id,
          num_groups: numGroups.value,
          grouping_strategy: groupingStrategy.value,
        },
      }
    );

    if (response.value?.success) {
      await _refreshGroups();
      showControls.value = false;

      // Show notification if groups were adjusted
      if (response.value.adjusted_groups) {
        toast.add({
          title: "Groups Adjusted",
          description: `Created ${response.value.created_groups} groups instead of ${response.value.requested_groups} due to having only ${response.value.total_students} students. Each group needs at least 2 students.`,
          color: "warning",
          icon: "i-heroicons-information-circle",
        });
      } else {
        toast.add({
          title: "Success",
          description: `Successfully generated ${response.value.created_groups} groups!`,
          color: "success",
          icon: "i-heroicons-check-circle",
        });
      }
    }
  } catch (error) {
    console.error("Failed to generate groups:", error);
    toast.add({
      title: "Generation Failed",
      description:
        "Failed to generate groups. Please ensure students have submitted responses.",
      color: "error",
      icon: "i-heroicons-x-circle",
    });
  } finally {
    generating.value = false;
  }
}

function editGroup(group: Group) {
  // Implement edit functionality
  toast.add({
    title: "Coming Soon",
    description: `Edit functionality for ${group.name} will be available soon!`,
    color: "info",
    icon: "i-heroicons-information-circle",
  });
}
</script>
