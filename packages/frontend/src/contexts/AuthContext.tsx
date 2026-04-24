import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi } from '../api/auth.api';
import type { User, LoginRequest, RegisterRequest } from '../types/user';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      authApi
        .getProfile()
        .then(setUser)
        .catch(() => localStorage.removeItem('accessToken'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const result = await authApi.login(data);
    localStorage.setItem('accessToken', result.accessToken);
    setUser(result.user);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const result = await authApi.register(data);
    localStorage.setItem('accessToken', result.accessToken);
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    localStorage.removeItem('accessToken');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
