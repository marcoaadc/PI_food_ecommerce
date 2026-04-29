import type { Product } from '../../types/product';
import { groupByCategory } from '../../utils/groupByCategory';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export function ProductGrid({ products, loading, error }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-20" />
                <div className="h-9 bg-gray-200 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Nenhum produto encontrado</p>
      </div>
    );
  }

  const grouped = groupByCategory(products);

  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
