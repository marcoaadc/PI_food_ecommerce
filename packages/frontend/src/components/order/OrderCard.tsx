import type { Order } from '../../types/order';
import { formatBRL } from '../../utils/currency';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const date = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-sm text-gray-500">Pedido #{order.id}</span>
          <span className="text-sm text-gray-400 ml-3">{date}</span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="space-y-1 mb-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-700">
              {item.quantity}x {item.productName}
            </span>
            <span className="text-gray-500">
              {formatBRL(parseFloat(item.unitPrice) * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t pt-2 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {order.address.street}, {order.address.number} — {order.address.district}
        </span>
        <span className="font-bold text-gray-800">{formatBRL(order.total)}</span>
      </div>
    </div>
  );
}
