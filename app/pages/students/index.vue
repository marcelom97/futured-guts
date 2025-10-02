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

      <!-- Modular Header -->
      <StudentsHeader 
        title="Students"
        subtitle="Manage your student roster"
        button-text="Add Student"
        @add-click="showAddModal = true"
      />

      <!-- Modular Table -->
      <StudentsTable 
        :students="students" 
        :loading="loading"
        @add-student="showAddModal = true"
        @open-groups="openGroupsModal"
        @open-questionnaires="openQuestionnairesModal"
      />
    </UContainer>

    <!-- Modular Add Student Modal -->
    <AddStudentModal 
      v-model:model-value="showAddModal"
      :adding="adding"
      :new-student="newStudent"
      @update:new-student="newStudent = $event"
      @add="addStudent"
    />

    <!-- Modular Groups Modal -->
    <StudentGroupsModal 
      v-model:model-value="showGroupsModal"
      :student="selectedStudent"
      :loading="loadingGroups"
      :groups="studentGroups"
      @view-group="navigateToGroup"
    />

    <!-- Modular Questionnaires Modal -->
    <StudentQuestionnairesModal 
      v-model:model-value="showQuestionnairesModal"
      :student="selectedStudent"
      :loading="loadingQuestionnaires"
      :questionnaires="studentQuestionnaires"
      @view-responses="navigateToQuestionnaire"
    />
  </div>
</template>

<script setup lang="ts">
import type { Student, StudentGroup, StudentQuestionnaire, NewStudent } from '~/types/students';

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
const newStudent = ref<NewStudent>({
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