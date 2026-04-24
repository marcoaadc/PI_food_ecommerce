import apiClient from './client';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/user';

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  refresh: () =>
    apiClient.post<{ accessToken: string }>('/auth/refresh').then((r) => r.data),

  logout: () =>
    apiClient.post('/auth/logout').then((r) => r.data),

  getProfile: () =>
    apiClient.get<User>('/users/me').then((r) => r.data),
};
