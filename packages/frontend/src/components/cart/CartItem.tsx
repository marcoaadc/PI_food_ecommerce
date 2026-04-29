import { useCart } from '../../hooks/useCart';
import { formatBRL } from '../../utils/currency';
import type { CartItem as CartItemType } from '../../types/cart';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <span className="text-lg">🍔</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
        <p className="text-sm text-amber-600 font-semibold">{formatBRL(item.price)}</p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded text-gray-600 hover:bg-gray-200 transition cursor-pointer text-sm"
        >
          −
        </button>
        <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded text-gray-600 hover:bg-gray-200 transition cursor-pointer text-sm"
        >
          +
        </button>
      </div>

      <button
        onClick={() => removeItem(item.id)}
        className="text-gray-400 hover:text-red-500 transition cursor-pointer ml-1"
        title="Remover"
      >
        ✕
      </button>
    </div>
  );
}
