// Student-related interfaces

export interface Student {
  id: number;
  name: string;
  email: string;
  teacher_id: number;
  created_at: string;
  group_count: number;
  questionnaire_count: number;
}

export interface GroupMember {
  id: number;
  name: string;
  email: string;
}

export interface StudentGroup {
  id: number;
  name: string;
  questionnaire_id: number;
  questionnaire_title: string;
  questionnaire_description: string;
  member_count: number;
  created_at: string;
  members: GroupMember[];
}

export interface StudentQuestionnaire {
  id: number;
  title: string;
  description: string;
  teacher_id: number;
  created_at: string;
  total_questions: number;
  answered_questions: number;
  completion_percentage: number;
}

export interface NewStudent {
  name: string;
  email: string;
}

export interface StudentsResponse {
  success: boolean;
  students: Student[];
}

export interface StudentGroupsResponse {
  success: boolean;
  groups: StudentGroup[];
}

export interface StudentQuestionnairesResponse {
  success: boolean;
  questionnaires: StudentQuestionnaire[];
}