import { useCart } from '../../hooks/useCart';
import { formatBRL } from '../../utils/currency';
import { CartItem } from './CartItem';
import { Link } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totalPrice, totalItems, clearCart } = useCart();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          role="button"
          aria-label="Fechar carrinho"
          tabIndex={0}
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClose();
            }
          }}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">
            Sacola ({totalItems})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-gray-400 text-center mt-8">
              Sua sacola está vazia
            </p>
          ) : (
            items.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total</span>
              <span className="text-xl font-bold text-gray-800">
                {formatBRL(totalPrice)}
              </span>
            </div>

            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full bg-amber-500 text-white text-center py-3 rounded-lg font-medium hover:bg-amber-600 transition"
            >
              Finalizar Pedido
            </Link>

            <button
              onClick={clearCart}
              className="w-full text-sm text-gray-400 hover:text-red-500 transition cursor-pointer"
            >
              Limpar sacola
            </button>
          </div>
        )}
      </div>
    </>
  );
}
