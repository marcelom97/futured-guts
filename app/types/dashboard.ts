// Common interfaces shared across components

export interface Questionnaire {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

export interface QuestionnaireResponse {
  success: boolean;
  questionnaires: Questionnaire[];
}