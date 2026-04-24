import apiClient from './client';
import type { Address, CreateAddressRequest } from '../types/address';

export const addressesApi = {
  getAll: () =>
    apiClient.get<Address[]>('/addresses').then((r) => r.data),

  create: (data: CreateAddressRequest) =>
    apiClient.post<Address>('/addresses', data).then((r) => r.data),

  update: (id: number, data: Partial<CreateAddressRequest>) =>
    apiClient.patch<Address>(`/addresses/${id}`, data).then((r) => r.data),

  remove: (id: number) =>
    apiClient.delete(`/addresses/${id}`).then((r) => r.data),

  select: (id: number) =>
    apiClient.post<Address>(`/addresses/${id}/select`).then((r) => r.data),
};
