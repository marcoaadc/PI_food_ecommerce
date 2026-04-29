import apiClient from './client';
import type { Product, CreateProductRequest, ProductsResponse } from '../types/product';

export const productsApi = {
  getAll: (params?: { category?: string; page?: number; limit?: number }) =>
    apiClient.get<ProductsResponse>('/products', { params }).then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<Product>(`/products/${id}`).then((r) => r.data),

  getCategories: () =>
    apiClient.get<string[]>('/products/categories').then((r) => r.data),

  create: (data: CreateProductRequest) =>
    apiClient.post<Product>('/products', data).then((r) => r.data),

  remove: (id: number) =>
    apiClient.delete(`/products/${id}`).then((r) => r.data),
};
