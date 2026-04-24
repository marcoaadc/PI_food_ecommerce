import apiClient from './client';
import type { PaymentMethod, CreatePaymentMethodRequest } from '../types/payment-method';

export const paymentMethodsApi = {
  getAll: () =>
    apiClient.get<PaymentMethod[]>('/payment-methods').then((r) => r.data),

  create: (data: CreatePaymentMethodRequest) =>
    apiClient.post<PaymentMethod>('/payment-methods', data).then((r) => r.data),

  remove: (id: number) =>
    apiClient.delete(`/payment-methods/${id}`).then((r) => r.data),

  select: (id: number) =>
    apiClient.post<PaymentMethod>(`/payment-methods/${id}/select`).then((r) => r.data),
};
