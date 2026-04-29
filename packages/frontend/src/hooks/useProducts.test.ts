import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProducts, useCategories } from './useProducts';

vi.mock('../api/products.api', () => ({
  productsApi: {
    getAll: vi.fn(),
    getCategories: vi.fn(),
  },
}));

import { productsApi } from '../api/products.api';

const mockedProductsApi = vi.mocked(productsApi);

const mockProducts = [
  {
    id: 1,
    name: 'X-Burguer',
    description: null,
    price: '25.90',
    stock: 10,
    imageUrl: null,
    category: 'Lanches',
    isActive: true,
  },
  {
    id: 2,
    name: 'Pizza Margherita',
    description: 'Pizza classica',
    price: '35.00',
    stock: 5,
    imageUrl: null,
    category: 'Pizzas',
    isActive: true,
  },
];

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna produtos apos carregamento', async () => {
    mockedProductsApi.getAll.mockResolvedValue({
      data: mockProducts,
      meta: { total: 2, page: 1, limit: 100, totalPages: 1 },
    });

    const { result } = renderHook(() => useProducts());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
  });

  it('define estado de erro quando a requisicao falha', async () => {
    mockedProductsApi.getAll.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe('Erro ao carregar produtos');
  });

  it('filtra por categoria quando fornecida', async () => {
    mockedProductsApi.getAll.mockResolvedValue({
      data: [mockProducts[0]],
      meta: { total: 1, page: 1, limit: 100, totalPages: 1 },
    });

    const { result } = renderHook(() => useProducts('Lanches'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedProductsApi.getAll).toHaveBeenCalledWith({
      category: 'Lanches',
      limit: 100,
    });
  });
});

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna categorias apos carregamento', async () => {
    mockedProductsApi.getCategories.mockResolvedValue([
      'Lanches',
      'Pizzas',
      'Bebidas',
    ]);

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.categories).toEqual([
        'Lanches',
        'Pizzas',
        'Bebidas',
      ]);
    });

    expect(result.current.error).toBeNull();
  });

  it('define erro quando a requisicao falha', async () => {
    mockedProductsApi.getCategories.mockRejectedValue(
      new Error('Network error'),
    );

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.error).toBe('Erro ao carregar categorias');
    });
  });
});
