import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnalysisState {
  progress: number;
  result: any | null;
  thinking: string | null;
  loading: boolean;
}

const initialState: AnalysisState = {
  progress: 0,
  result: null,
  thinking: null,
  loading: false,
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    setResult: (state, action: PayloadAction<any>) => {
      state.result = action.payload;
    },
    setThinking: (state, action: PayloadAction<string | null>) => {
      state.thinking = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    reset: (state) => {
      state.progress = 0;
      state.result = null;
      state.thinking = null;
      state.loading = false;
    },
  },
});

export const { setProgress, setResult, setThinking, setLoading, reset } = analysisSlice.actions;
export default analysisSlice.reducer;

