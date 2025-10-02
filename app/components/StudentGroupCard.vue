<template>
  <div class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <UIcon
            name="i-heroicons-users"
            class="h-4 w-4 text-gray-400"
          />
          <h3 class="text-sm font-medium text-gray-900">
            {{ group.name }}
          </h3>
        </div>
        <div class="flex items-center gap-1 mt-1">
          <UIcon
            name="i-heroicons-document-text"
            class="h-3 w-3 text-gray-400"
          />
          <p class="text-xs text-gray-500">
            Questionnaire: {{ group.questionnaire_title }}
          </p>
        </div>
        <div class="flex items-center gap-4 mt-1">
          <div class="flex items-center gap-1">
            <UIcon
              name="i-heroicons-user-group"
              class="h-3 w-3 text-gray-400"
            />
            <p class="text-xs text-gray-400">
              {{ group.member_count }}
              {{ group.member_count === 1 ? "member" : "members" }}
            </p>
          </div>
          <div class="flex items-center gap-1">
            <UIcon
              name="i-heroicons-calendar"
              class="h-3 w-3 text-gray-400"
            />
            <p class="text-xs text-gray-400">
              Created {{ formatDate(group.created_at) }}
            </p>
          </div>
        </div>
      </div>
      <UButton
        size="xs"
        color="primary"
        variant="outline"
        icon="i-heroicons-users"
        @click="$emit('viewGroup')"
      >
        View Group
      </UButton>
    </div>

    <div v-if="group.members.length > 0" class="mt-3">
      <div class="flex items-center gap-1 mb-2">
        <UIcon name="i-heroicons-users" class="h-3 w-3 text-gray-400" />
        <p class="text-xs text-gray-500">Members:</p>
      </div>
      <div class="flex flex-wrap gap-1 ml-4">
        <StudentMemberBadge
          v-for="member in group.members"
          :key="member.id"
          :member="member"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StudentGroup } from '~/types/students';

interface Props {
  group: StudentGroup;
}

defineProps<Props>();

defineEmits<{
  viewGroup: [];
}>();

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}
</script>