// Common interfaces shared across components

export interface Questionnaire {
  id: number;
  teacher_id: number;
  title: string;
  description: string;
  created_at: string;
  responses_count?: number;
  total_students?: number;
  last_response_at?: string;
}

export interface QuestionnaireResponse {
  success: boolean;
  questionnaires: Questionnaire[];
}