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

export type QuestionType = "scale" | "multiple_choice" | "text";
export type QuestionCategory = "behavioral" | "hard_skill";

export interface Question {
  id: number;
  questionnaire_id: number;
  question_text: string;
  question_type: QuestionType;
  category: QuestionCategory;
  trait: string;
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

