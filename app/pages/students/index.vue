<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"
          ></div>
        </div>

        <div v-else-if="students.length === 0" class="text-center py-12">
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
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
                  <div class="flex items-center">
                    <div
                      class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold"
                    >
                      {{ student.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ student.name }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ student.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ new Date(student.created_at).toLocaleDateString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>

    <!-- Add Student Modal -->
    <UModal v-model="showAddModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Add Student</h3>
        </template>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <UInput v-model="newStudent.name" placeholder="Full name" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <UInput
              v-model="newStudent.email"
              type="email"
              placeholder="student@example.com"
            />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton @click="showAddModal = false" variant="outline">
              Cancel
            </UButton>
            <UButton
              @click="addStudent"
              :loading="adding"
              color="primary"
              icon="i-heroicons-check"
            >
              Add Student
            </UButton>
          </div>
        </template>
      </UCard>
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
