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
          color="primary"
          icon="i-heroicons-plus"
          @click="showAddModal = true"
        >
          Add Student
        </UButton>
      </div>

      <UCard>
        <div v-if="loading" class="text-center py-8">
          <UIcon
            name="i-heroicons-arrow-path"
            class="animate-spin h-8 w-8 text-primary mx-auto"
          />
          <p class="mt-2 text-sm text-gray-600">Loading students...</p>
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
            <UButton icon="i-heroicons-plus" @click="showAddModal = true">
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
                  Groups
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Questionnaires
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
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <button
                      v-if="student.group_count > 0"
                      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                      @click="openGroupsModal(student)"
                    >
                      <UIcon name="i-heroicons-users" class="h-3 w-3" />
                      {{ student.group_count }}
                      {{ student.group_count === 1 ? "group" : "groups" }}
                    </button>
                    <span
                      v-else
                      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                    >
                      <UIcon name="i-heroicons-users" class="h-3 w-3" />
                      0 groups
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <button
                      v-if="student.questionnaire_count > 0"
                      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors cursor-pointer"
                      @click="openQuestionnairesModal(student)"
                    >
                      <UIcon name="i-heroicons-document-text" class="h-3 w-3" />
                      {{ student.questionnaire_count }}
                      {{
                        student.questionnaire_count === 1
                          ? "questionnaire"
                          : "questionnaires"
                      }}
                    </button>
                    <span
                      v-else
                      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                    >
                      <UIcon name="i-heroicons-document-text" class="h-3 w-3" />
                      0 questionnaires
                    </span>
                  </div>
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
            color="neutral"
            variant="outline"
            icon="i-heroicons-x-mark"
            :disabled="adding"
            @click="showAddModal = false"
          >
            Cancel
          </UButton>
          <UButton
            color="primary"
            icon="i-heroicons-check"
            :loading="adding"
            :disabled="adding"
            @click="addStudent"
          >
            {{ adding ? "Adding..." : "Add Student" }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Student Groups Modal -->
    <UModal
      v-model:open="showGroupsModal"
      :title="`${selectedStudent?.name}'s Groups`"
    >
      <template #body>
        <div v-if="loadingGroups" class="text-center py-8">
          <UIcon
            name="i-heroicons-arrow-path"
            class="animate-spin h-8 w-8 text-primary mx-auto"
          />
          <p class="mt-2 text-sm text-gray-600">Loading groups...</p>
        </div>

        <div v-else-if="studentGroups.length === 0" class="text-center py-8">
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
          <h3 class="mt-2 text-sm font-medium text-gray-900">No groups</h3>
          <p class="mt-1 text-sm text-gray-500">
            This student is not a member of any groups yet.
          </p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="group in studentGroups"
            :key="group.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
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
                      Created
                      {{ new Date(group.created_at).toLocaleDateString() }}
                    </p>
                  </div>
                </div>
              </div>
              <UButton
                size="xs"
                color="primary"
                variant="outline"
                icon="i-heroicons-users"
                @click="navigateToGroup(group)"
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
                <span
                  v-for="member in group.members"
                  :key="member.id"
                  class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
                >
                  <UIcon name="i-heroicons-user" class="h-3 w-3" />
                  {{ member.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex items-center justify-end">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-heroicons-x-mark"
            @click="showGroupsModal = false"
          >
            Close
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Student Questionnaires Modal -->
    <UModal
      v-model:open="showQuestionnairesModal"
      :title="`${selectedStudent?.name}'s Questionnaires`"
    >
      <template #body>
        <div v-if="loadingQuestionnaires" class="text-center py-8">
          <UIcon
            name="i-heroicons-arrow-path"
            class="animate-spin h-8 w-8 text-primary mx-auto"
          />
          <p class="mt-2 text-sm text-gray-600">Loading questionnaires...</p>
        </div>

        <div
          v-else-if="studentQuestionnaires.length === 0"
          class="text-center py-8"
        >
          <UIcon
            name="i-heroicons-document-text"
            class="mx-auto h-12 w-12 text-gray-400"
          />
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            No questionnaires
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            This student hasn't completed any questionnaires yet.
          </p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="questionnaire in studentQuestionnaires"
            :key="questionnaire.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-heroicons-document-text"
                    class="h-4 w-4 text-gray-400"
                  />
                  <h3 class="text-sm font-medium text-gray-900">
                    {{ questionnaire.title }}
                  </h3>
                </div>
                <p
                  v-if="questionnaire.description"
                  class="text-xs text-gray-500 mt-1 ml-6"
                >
                  {{ questionnaire.description }}
                </p>
                <div class="flex items-center gap-4 mt-2 ml-6">
                  <div class="flex items-center gap-1">
                    <UIcon
                      name="i-heroicons-clipboard-document-check"
                      class="h-3 w-3 text-gray-400"
                    />
                    <span class="text-xs text-gray-500">
                      {{ questionnaire.answered_questions }}/{{
                        questionnaire.total_questions
                      }}
                      questions answered
                    </span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                      <div
                        class="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                        :style="{
                          width: questionnaire.completion_percentage + '%',
                        }"
                      />
                    </div>
                    <span class="text-xs text-gray-500"
                      >{{ questionnaire.completion_percentage }}%</span
                    >
                  </div>
                </div>
                <div class="flex items-center gap-1 mt-1 ml-6">
                  <UIcon
                    name="i-heroicons-calendar"
                    class="h-3 w-3 text-gray-400"
                  />
                  <p class="text-xs text-gray-400">
                    Created
                    {{
                      new Date(questionnaire.created_at).toLocaleDateString()
                    }}
                  </p>
                </div>
              </div>
              <div class="flex gap-2">
                <UButton
                  size="xs"
                  color="success"
                  variant="outline"
                  icon="i-heroicons-document-chart-bar"
                  @click="navigateToQuestionnaire(questionnaire)"
                >
                  View All Responses
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex items-center justify-end">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-heroicons-x-mark"
            @click="showQuestionnairesModal = false"
          >
            Close
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface Student {
  id: number;
  name: string;
  email: string;
  teacher_id: number;
  created_at: string;
  group_count: number;
  questionnaire_count: number;
}

interface GroupMember {
  id: number;
  name: string;
  email: string;
}

interface StudentGroup {
  id: number;
  name: string;
  questionnaire_id: number;
  questionnaire_title: string;
  questionnaire_description: string;
  member_count: number;
  created_at: string;
  members: GroupMember[];
}

interface StudentQuestionnaire {
  id: number;
  title: string;
  description: string;
  teacher_id: number;
  created_at: string;
  total_questions: number;
  answered_questions: number;
  completion_percentage: number;
}

const toast = useToast();

// Mock teacher ID
const teacherId = 1;

// Use useFetch for initial data loading with better SSR support
const { data: studentsResponse, pending: loading, refresh: _refreshStudents } = await useFetch<{
  success: boolean;
  students: Student[];
}>(`/api/students?teacher_id=${teacherId}`, {
  default: () => ({ success: false, students: [] })
});

// Compute students from the response
const students = computed(() => {
  return studentsResponse.value?.success ? studentsResponse.value.students || [] : [];
});

const adding = ref(false);
const showAddModal = ref(false);
const showGroupsModal = ref(false);
const showQuestionnairesModal = ref(false);
const loadingGroups = ref(false);
const loadingQuestionnaires = ref(false);
const selectedStudent = ref<Student | null>(null);
const studentGroups = ref<StudentGroup[]>([]);
const studentQuestionnaires = ref<StudentQuestionnaire[]>([]);
const newStudent = ref({
  name: "",
  email: "",
});

async function addStudent() {
  if (!newStudent.value.name || !newStudent.value.email) {
    toast.add({
      title: "Validation Error",
      description: "Please fill in all fields",
      color: "warning",
    });
    return;
  }

  adding.value = true;
  try {
    const { data: _response } = await useLazyFetch("/api/students", {
      method: "POST",
      body: {
        ...newStudent.value,
        teacher_id: teacherId,
      },
    });

    await _refreshStudents();
    showAddModal.value = false;
    newStudent.value = { name: "", email: "" };

    toast.add({
      title: "Success",
      description: "Student added successfully",
      color: "success",
    });
  } catch (error) {
    console.error("Failed to add student:", error);
    toast.add({
      title: "Error",
      description: "Failed to add student. Please try again.",
      color: "error",
    });
  } finally {
    adding.value = false;
  }
}

async function openGroupsModal(student: Student) {
  selectedStudent.value = student;
  showGroupsModal.value = true;
  loadingGroups.value = true;
  studentGroups.value = [];

  try {
    const { data: response } = await useLazyFetch<{
      success: boolean;
      groups: StudentGroup[];
    }>(`/api/students/${student.id}/groups`);
    
    if (response.value?.success) {
      studentGroups.value = response.value.groups || [];
    }
  } catch (error) {
    console.error("Failed to load student groups:", error);
    toast.add({
      title: "Error",
      description: "Failed to load groups. Please try again.",
      color: "error",
    });
  } finally {
    loadingGroups.value = false;
  }
}

function navigateToGroup(group: StudentGroup) {
  // Navigate to the questionnaire groups page with the specific group
  navigateTo(`/questionnaires/${group.questionnaire_id}/groups`);
}

async function openQuestionnairesModal(student: Student) {
  selectedStudent.value = student;
  showQuestionnairesModal.value = true;
  loadingQuestionnaires.value = true;
  studentQuestionnaires.value = [];

  try {
    const { data: response } = await useLazyFetch<{
      success: boolean;
      questionnaires: StudentQuestionnaire[];
    }>(`/api/students/${student.id}/questionnaires`);
    
    if (response.value?.success) {
      studentQuestionnaires.value = response.value.questionnaires || [];
    }
  } catch (error) {
    console.error("Failed to load student questionnaires:", error);
    toast.add({
      title: "Error",
      description: "Failed to load questionnaires. Please try again.",
      color: "error",
    });
  } finally {
    loadingQuestionnaires.value = false;
  }
}

function navigateToQuestionnaire(questionnaire: StudentQuestionnaire) {
  // Navigate to the questionnaire responses page
  navigateTo(`/questionnaires/${questionnaire.id}/responses`);
}
</script>
