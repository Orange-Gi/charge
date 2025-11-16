import axios from 'axios';
import { store } from '../store/store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// 统一响应错误处理：提取后端的 detail
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail =
      error?.response?.data?.detail ||
      error?.message ||
      '请求失败，请稍后重试';
    return Promise.reject(new Error(detail));
  }
);

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: async (payload: { username: string; email: string; password: string }) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
  login: async (payload: { username: string; password: string }) => {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },
};

export const analysisApi = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/analysis/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
  startAnalysis: async (taskId: string) => {
    const { data } = await api.post(`/analysis/start/${taskId}`);
    return data;
  },
  getProgress: async (taskId: string) => {
    const { data } = await api.get(`/analysis/${taskId}/progress`);
    return data;
  },
  getResult: async (taskId: string) => {
    const { data } = await api.get(`/analysis/${taskId}/report`);
    return data;
  },
  streamResult: async (taskId: string, onChunk: (chunk: any) => void) => {
    const response = await fetch(`${API_BASE_URL}/analysis/${taskId}/result/stream`, {
      headers: {
        Authorization: `Bearer ${store.getState().auth.token}`,
      },
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const lines = text.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(line.slice(6));
            onChunk(parsed);
          } catch (error) {
            console.warn('流式解析失败', error);
          }
        }
      }
    }
  },
};

export const ragApi = {
  search: async (query: string) => {
    const { data } = await api.post('/rag/query', { query });
    return data;
  },
};

export const logsApi = {
  list: async (params?: { severity?: string }) => {
    const { data } = await api.get('/logs', { params });
    return data;
  },
};

export const trainingApi = {
  list: async () => {
    const { data } = await api.get('/training');
    return data;
  },
};
