import { useState } from 'react';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { ProductGrid } from '../../components/product/ProductGrid';

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const categories = useCategories();
  const { products, loading, error } = useProducts(selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <section className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Bem-vindo ao <span className="text-amber-500">Burguer House</span>
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Os melhores lanches, pizzas e bebidas da cidade
        </p>
      </section>

      {categories.length > 0 && (
        <div className="flex gap-2 mb-8 flex-wrap justify-center">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
              !selectedCategory
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <ProductGrid products={products} loading={loading} error={error} />
    </div>
  );
}
