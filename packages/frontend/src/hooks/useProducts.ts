import { useCallback, useEffect, useState } from 'react';
import { productsApi } from '../api/products.api';
import type { Product } from '../types/product';

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.getAll({ category, limit: 100 });
      setProducts(res.data);
    } catch {
      setError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { products, loading, error, refetch: fetch };
}

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    productsApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  return categories;
}
