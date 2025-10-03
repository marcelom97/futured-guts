<template>
  <div class="mb-8">
    <div class="flex items-center gap-4">
      <div class="flex-shrink-0">
        <div class="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span class="text-2xl font-bold text-white">
            {{ getInitials(student.name) }}
          </span>
        </div>
      </div>
      
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ student.name }}
        </h1>
        <p class="text-gray-600">{{ student.email }}</p>
        <p class="text-sm text-gray-400">
          Joined {{ new Date(student.created_at).toLocaleDateString() }}
        </p>
      </div>

      <div class="flex-shrink-0">
        <UDropdown :items="actionItems" :popper="{ placement: 'bottom-end' }">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-heroicons-ellipsis-vertical"
            trailing-icon="i-heroicons-chevron-down"
          >
            Actions
          </UButton>
        </UDropdown>
      </div>
    </div>
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

interface Props {
  student: Student
}

defineProps<Props>()

const actionItems = [
  [
    {
      label: 'Edit Student',
      icon: 'i-heroicons-pencil',
      click: () => console.log('Edit student')
    },
    {
      label: 'Send Email',
      icon: 'i-heroicons-envelope',
      click: () => console.log('Send email')
    }
  ],
  [
    {
      label: 'Remove Student',
      icon: 'i-heroicons-trash',
      click: () => console.log('Remove student')
    }
  ]
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}
</script>