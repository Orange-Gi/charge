import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setCredentials, logout } from '../store/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const login = (user: any, token: string) => {
    dispatch(setCredentials({ user, token }));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout: logoutUser,
  };
}

