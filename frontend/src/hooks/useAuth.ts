import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logout } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store/store';
import type { User } from '../types';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);

  const login = useCallback(
    (user: User, token: string) => {
      dispatch(setCredentials({ user, token }));
    },
    [dispatch]
  );

  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    ...authState,
    login,
    logout: logoutUser,
  };
}

