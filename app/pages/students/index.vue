<template>
  <div class="min-h-screen bg-white">
    <UContainer class="py-12">
      <UButton
        to="/"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="mb-4"
      >
        Back to Dashboard
      </UButton>

      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Students</h1>
          <p class="mt-2 text-gray-600">Manage your student roster</p>
        </div>
        <UButton
          @click="showAddModal = true"
          color="primary"
          icon="i-heroicons-plus"
        >
          Add Student
        </UButton>
      </div>

      <UCard>
        <div v-if="loading" class="text-center py-8">
          <USpinner size="lg" />
        </div>

        <div v-else-if="students.length === 0" class="text-center py-12">
          <UIcon
            name="i-heroicons-users"
            class="mx-auto h-12 w-12 text-gray-400"
          />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No students</h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by adding a student.
          </p>
          <div class="mt-6">
            <UButton @click="showAddModal = true" icon="i-heroicons-plus">
              Add Student
            </UButton>
          </div>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Added
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="student in students"
                :key="student.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <UAvatar
                      :text="student.name.charAt(0).toUpperCase()"
                      size="md"
                    />
                    <span class="text-sm font-medium text-gray-900">{{
                      student.name
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">{{ student.email }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ new Date(student.created_at).toLocaleDateString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </UContainer>

    <!-- Add Student Modal -->
    <UModal v-model:open="showAddModal" title="Add Student">
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <UInput
              v-model="newStudent.name"
              placeholder="Full name"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <UInput
              v-model="newStudent.email"
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
            @click="showAddModal = false"
            color="neutral"
            variant="outline"
            :disabled="adding"
          >
            Cancel
          </UButton>
          <UButton
            @click="addStudent"
            :loading="adding"
            :disabled="adding"
            color="primary"
            icon="i-heroicons-check"
          >
            {{ adding ? "Adding..." : "Add Student" }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const students = ref<any[]>([]);
const loading = ref(true);
const adding = ref(false);
const showAddModal = ref(false);
const newStudent = ref({
  name: "",
  email: "",
});

// Mock teacher ID
const teacherId = 1;

onMounted(async () => {
  await loadStudents();
});

async function loadStudents() {
  try {
    const response = await $fetch(`/api/students?teacher_id=${teacherId}`);
    if (response.success) {
      students.value = response.students || [];
    }
  } catch (error) {
    console.error("Failed to load students:", error);
  } finally {
    loading.value = false;
  }
}

async function addStudent() {
  if (!newStudent.value.name || !newStudent.value.email) {
    alert("Please fill in all fields");
    return;
  }

  adding.value = true;
  try {
    await $fetch("/api/students", {
      method: "POST",
      body: {
        ...newStudent.value,
        teacher_id: teacherId,
      },
    });

    await loadStudents();
    showAddModal.value = false;
    newStudent.value = { name: "", email: "" };
  } catch (error) {
    console.error("Failed to add student:", error);
    alert("Failed to add student. Please try again.");
  } finally {
    adding.value = false;
  }
}
</script>
