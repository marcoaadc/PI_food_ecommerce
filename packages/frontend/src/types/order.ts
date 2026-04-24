import type { Address } from './address';

export type OrderStatus = 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: string;
  productName: string;
}

export interface Order {
  id: number;
  userId: number;
  total: string;
  status: OrderStatus;
  createdAt: string;
  completedAt: string | null;
  deliveredAt: string | null;
  items: OrderItem[];
  address: Address;
  user?: { id: number; name: string; email: string };
}

export interface CreateOrderRequest {
  items: { productId: number; quantity: number }[];
}
