export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AnalysisReport {
  taskId: string;
  summary: string;
  recommendations: string[];
  metrics: {
    efficiency: number;
    reliability: number;
    safety: number;
  };
  timeline?: Array<{
    label: string;
    value: number;
  }>;
}

export interface LogEntry {
  id: string;
  module: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: string;
  owner?: string;
}

export interface TrainingJob {
  id: string;
  name: string;
  owner: string;
  progress: number;
  status: 'queued' | 'running' | 'completed' | 'failed';
  updatedAt: string;
}
