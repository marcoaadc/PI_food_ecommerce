import apiClient from './client';
import type { Order, CreateOrderRequest, OrderStatus } from '../types/order';

export const ordersApi = {
  create: (data: CreateOrderRequest) =>
    apiClient.post<Order>('/orders', data).then((r) => r.data),

  getAll: (status?: OrderStatus) =>
    apiClient.get<Order[]>('/orders', { params: status ? { status } : {} }).then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<Order>(`/orders/${id}`).then((r) => r.data),

  updateStatus: (id: number, status: OrderStatus) =>
    apiClient.patch<Order>(`/orders/${id}/status`, { status }).then((r) => r.data),

  cancel: (id: number) =>
    apiClient.delete(`/orders/${id}`).then((r) => r.data),
};
