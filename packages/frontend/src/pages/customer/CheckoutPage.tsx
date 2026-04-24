import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { ordersApi } from '../../api/orders.api';
import { formatBRL } from '../../utils/currency';
import { AddressList } from '../../components/address/AddressList';
import { PaymentMethodList } from '../../components/payment/PaymentMethodList';

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleOrder = async () => {
    if (items.length === 0) return;

    setError('');
    setLoading(true);
    try {
      await ordersApi.create({
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });
      clearCart();
      navigate('/orders', { state: { success: true } });
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response: { data: { message: string } } }).response?.data?.message
          : 'Erro ao criar pedido';
      setError(typeof msg === 'string' ? msg : String(msg));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-400 text-lg">Seu carrinho está vazio</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Finalizar Pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AddressList />
          <PaymentMethodList />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 h-fit sticky top-4">
          <h3 className="font-semibold text-gray-800 mb-4">Resumo do Pedido</h3>

          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-gray-800">
                  {formatBRL(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 mb-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Total</span>
              <span className="text-xl font-bold text-gray-800">
                {formatBRL(totalPrice)}
              </span>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          <button
            onClick={handleOrder}
            disabled={loading}
            className="w-full bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Fazer Pedido'}
          </button>
        </div>
      </div>
    </div>
  );
}
