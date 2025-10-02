export interface Teacher {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  teacher_id: number;
  created_at: string;
}

export interface Questionnaire {
  id: number;
  teacher_id: number;
  title: string;
  description?: string;
  created_at: string;
}

export type QuestionType =
  | "scale"
  | "multiple_choice"
  | "text"
  | "yes_no"
  | "ranking";
export type QuestionCategory =
  | "behavioral"
  | "hard_skill"
  | "soft_skill"
  | "technical"
  | "personality";

export interface Question {
  id: number;
  questionnaire_id: number;
  question_text: string;
  question_type: QuestionType;
  category: QuestionCategory;
  trait: string[];
  weight: number;
  options?: string[]; // for multiple choice
  created_at: string;
}

export interface Response {
  id: number;
  student_id: number;
  question_id: number;
  response_value: string;
  created_at: string;
}

export interface Group {
  id: number;
  questionnaire_id: number;
  name: string;
  created_at: string;
  members?: Student[];
}

export interface TraitWeight {
  id: number;
  questionnaire_id: number;
  trait: string;
  weight: number;
}

export interface StudentProfile {
  student: Student;
  scores: Record<string, number>; // trait -> normalized score
}

export interface GroupingResult {
  groups: Group[];
  balance_score: number;
  diversity_metrics: Record<string, number>;
}

// API Response Types
export interface GenerateGroupsResponse {
  success: boolean;
  groups: Array<{
    id: number | bigint;
    name: string;
    student_ids: number[];
    reasoning: string;
  }>;
  balance_score: number;
  diversity_explanation: string;
  adjusted_groups: boolean;
  requested_groups: number;
  created_groups: number;
  total_students: number;
}

export interface GetGroupsResponse {
  success: boolean;
  groups: Group[];
  balance_score: number | null;
  diversity_explanation: string | null;
}
