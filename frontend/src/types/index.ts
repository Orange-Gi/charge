export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
}

export interface AnalysisResult {
  task_id: string;
  summary: string;
  data: any;
}

