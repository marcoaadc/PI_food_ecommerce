import type { OrderStatus } from '../../types/order';

const config: Record<OrderStatus, { label: string; color: string }> = {
  PREPARING: { label: 'Em preparo', color: 'bg-yellow-100 text-yellow-800' },
  OUT_FOR_DELIVERY: { label: 'Saiu para entrega', color: 'bg-blue-100 text-blue-800' },
  DELIVERED: { label: 'Entregue', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, color } = config[status];
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${color}`}>
      {label}
    </span>
  );
}
