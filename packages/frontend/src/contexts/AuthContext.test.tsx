import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { AuthProvider, type AuthContextType } from './AuthContext';
import { useAuth } from '../hooks/useAuth';

const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@test.com',
  role: 'CUSTOMER' as const,
};

const mockAuthResponse = {
  user: mockUser,
  accessToken: 'fake-token-123',
};

vi.mock('../api/auth.api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getProfile: vi.fn(),
  },
}));

import { authApi } from '../api/auth.api';

const mockedAuthApi = vi.mocked(authApi);

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockedAuthApi.getProfile.mockRejectedValue(new Error('no token'));
  });

  it('inicia com usuario nulo e isAuthenticated false', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('login define o usuario e salva o token', async () => {
    mockedAuthApi.login.mockResolvedValue(mockAuthResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let returnedUser: AuthContextType['user'];
    await act(async () => {
      returnedUser = await result.current.login({
        email: 'test@test.com',
        password: '123456',
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('accessToken')).toBe('fake-token-123');
    expect(returnedUser!).toEqual(mockUser);
  });

  it('logout limpa o usuario e remove o token', async () => {
    mockedAuthApi.login.mockResolvedValue(mockAuthResponse);
    mockedAuthApi.logout.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.login({
        email: 'test@test.com',
        password: '123456',
      });
    });

    expect(result.current.user).toEqual(mockUser);

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('restaura o usuario a partir do token salvo', async () => {
    localStorage.setItem('accessToken', 'saved-token');
    mockedAuthApi.getProfile.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });
});
