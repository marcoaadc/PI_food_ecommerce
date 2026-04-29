import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ordersApi } from '../../api/orders.api';
import { OrderCard } from '../../components/order/OrderCard';
import type { Order } from '../../types/order';

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const showSuccess = (location.state as { success?: boolean })?.success;

  useEffect(() => {
    ordersApi
      .getAll()
      .then(setOrders)
      .catch(() => {
        setError('Erro ao carregar pedidos');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Meus Pedidos</h1>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6">
          Pedido realizado com sucesso!
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-400 text-center py-12">Nenhum pedido realizado</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
