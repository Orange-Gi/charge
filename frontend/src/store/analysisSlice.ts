import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnalysisReport } from '../types';

interface AnalysisState {
  progress: number;
  result: AnalysisReport | null;
  thinking: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalysisState = {
  progress: 0,
  result: null,
  thinking: null,
  loading: false,
  error: null,
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    setResult: (state, action: PayloadAction<AnalysisReport | null>) => {
      state.result = action.payload;
    },
    setThinking: (state, action: PayloadAction<string | null>) => {
      state.thinking = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    reset: () => initialState,
  },
});

export const { setProgress, setResult, setThinking, setLoading, setError, reset } =
  analysisSlice.actions;
export default analysisSlice.reducer;
