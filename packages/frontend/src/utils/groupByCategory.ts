import type { Product } from '../types/product';

export function groupByCategory(products: Product[]): Record<string, Product[]> {
  return products.reduce<Record<string, Product[]>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});
}
