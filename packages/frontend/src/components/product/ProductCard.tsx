import { useCart } from '../../hooks/useCart';
import type { Product } from '../../types/product';
import { formatBRL } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      imageUrl: product.imageUrl,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-4xl">🍔</span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
        {product.description && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-amber-600 font-bold text-lg">
            {formatBRL(product.price)}
          </span>
          <button
            onClick={handleAdd}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition cursor-pointer"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
