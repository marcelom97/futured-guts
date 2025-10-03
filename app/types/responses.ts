export interface Response {
  id: number;
  student_name: string;
  question_text: string;
  trait: string | string[];
  category: string;
  response_value: string;
  created_at: string;
}

export interface ResponseFilters {
  studentName: string;
  question: string;
  trait: string[];
}

export interface TraitOption {
  label: string;
  value: string;
}
