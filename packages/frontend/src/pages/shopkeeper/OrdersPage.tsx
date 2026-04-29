import { useCallback, useEffect, useState } from 'react';
import { ordersApi } from '../../api/orders.api';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';
import { formatBRL } from '../../utils/currency';
import type { Order, OrderStatus } from '../../types/order';

const TABS: { status: OrderStatus; label: string }[] = [
  { status: 'PREPARING', label: 'Em preparo' },
  { status: 'OUT_FOR_DELIVERY', label: 'Saiu para entrega' },
  { status: 'DELIVERED', label: 'Entregues' },
];

const NEXT_STATUS: Record<string, OrderStatus> = {
  PREPARING: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'DELIVERED',
};

const NEXT_LABEL: Record<string, string> = {
  PREPARING: 'Pedido pronto',
  OUT_FOR_DELIVERY: 'Marcar entregue',
};

export function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('PREPARING');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getAll(activeTab);
      setOrders(data);
    } catch {
      setError('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleAdvance = async (id: number, status: OrderStatus) => {
    const next = NEXT_STATUS[status];
    if (!next) return;
    await ordersApi.updateStatus(id, next);
    await fetch();
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Deseja cancelar este pedido?')) return;
    await ordersApi.cancel(id);
    await fetch();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pedidos</h1>

      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.status}
            onClick={() => setActiveTab(tab.status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
              activeTab === tab.status
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-lg p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-400 text-center py-12">Nenhum pedido nesta categoria</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-800">#{order.id}</span>
                  <span className="text-sm text-gray-500">{order.user?.name}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <span className="font-bold text-lg text-gray-800">
                  {formatBRL(order.total)}
                </span>
              </div>

              <div className="space-y-1 mb-3">
                {order.items.map((item) => (
                  <p key={item.id} className="text-sm text-gray-600">
                    {item.quantity}x {item.productName}
                  </p>
                ))}
              </div>

              <p className="text-sm text-gray-500 mb-4">
                {order.address.street}, {order.address.number} — {order.address.district}, {order.address.city}
              </p>

              <div className="flex gap-2">
                {NEXT_STATUS[order.status] && (
                  <button
                    onClick={() => handleAdvance(order.id, order.status)}
                    className="bg-amber-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-amber-600 transition cursor-pointer"
                  >
                    {NEXT_LABEL[order.status]}
                  </button>
                )}
                {order.status === 'PREPARING' && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="border border-red-300 text-red-500 px-4 py-2 rounded text-sm font-medium hover:bg-red-50 transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
