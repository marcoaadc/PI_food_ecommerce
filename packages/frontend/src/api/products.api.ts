import apiClient from './client';
import type { Product, ProductsResponse } from '../types/product';

export const productsApi = {
  getAll: (params?: { category?: string; page?: number; limit?: number }) =>
    apiClient.get<ProductsResponse>('/products', { params }).then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<Product>(`/products/${id}`).then((r) => r.data),

  getCategories: () =>
    apiClient.get<string[]>('/products/categories').then((r) => r.data),
};
