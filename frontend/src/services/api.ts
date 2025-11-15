import axios from 'axios';
import { store } from '../store/store';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加token
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权错误
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

export const analysisApi = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/analysis/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  startAnalysis: async (taskId: string) => {
    const response = await api.post(`/analysis/start/${taskId}`);
    return response.data;
  },
  getProgress: async (taskId: string) => {
    const response = await api.get(`/analysis/${taskId}/progress`);
    return response.data;
  },
  streamResult: async (taskId: string, onChunk: (chunk: any) => void) => {
    const response = await fetch(`${API_BASE_URL}/analysis/${taskId}/result/stream`, {
      headers: {
        Authorization: `Bearer ${store.getState().auth.token}`,
      },
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            onChunk(data);
          }
        }
      }
    }
  },
  getResult: async (taskId: string) => {
    const response = await api.get(`/analysis/${taskId}/report`);
    return response.data;
  },
};

