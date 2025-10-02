<template>
  <UModal v-model:open="isOpen" title="Add Student">
    <template #body>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <UInput
            v-model="studentData.name"
            placeholder="Full name"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <UInput
            v-model="studentData.email"
            type="email"
            placeholder="student@example.com"
            class="w-full"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-x-mark"
          :disabled="adding"
          @click="handleCancel"
        >
          Cancel
        </UButton>
        <UButton
          color="primary"
          icon="i-heroicons-check"
          :loading="adding"
          :disabled="adding"
          @click="handleAdd"
        >
          {{ adding ? "Adding..." : "Add Student" }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
interface NewStudent {
  name: string;
  email: string;
}

interface Props {
  modelValue: boolean;
  adding: boolean;
  newStudent: NewStudent;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:newStudent': [student: NewStudent];
  add: [];
  cancel: [];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const studentData = computed({
  get: () => props.newStudent,
  set: (value) => emit('update:newStudent', value)
});

function handleAdd() {
  emit('add');
}

function handleCancel() {
  emit('cancel');
}
</script>