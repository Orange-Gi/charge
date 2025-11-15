import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState, initialAuthState } from './authSlice';
import analysisReducer from './analysisSlice';

const loadAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return initialAuthState;
  }

  try {
    const cached = window.localStorage.getItem('authState');
    if (!cached) {
      return initialAuthState;
    }
    const parsed = JSON.parse(cached) as AuthState;
    return {
      ...initialAuthState,
      ...parsed,
      isAuthenticated: Boolean(parsed.token),
    };
  } catch (error) {
    console.warn('Auth state load failed:', error);
    return initialAuthState;
  }
};

const saveAuthState = (state: AuthState) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      'authState',
      JSON.stringify({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      })
    );
  } catch (error) {
    console.warn('Auth state persist failed:', error);
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    analysis: analysisReducer,
  },
  preloadedState: {
    auth: loadAuthState(),
  },
});

store.subscribe(() => {
  saveAuthState(store.getState().auth);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
