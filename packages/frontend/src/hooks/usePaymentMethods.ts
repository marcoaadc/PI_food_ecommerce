import { useCallback, useEffect, useState } from 'react';
import { paymentMethodsApi } from '../api/payment-methods.api';
import type { PaymentMethod, CreatePaymentMethodRequest } from '../types/payment-method';

export function usePaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentMethodsApi.getAll();
      setMethods(data);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status !== 401) {
        setError('Erro ao carregar metodos de pagamento');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = async (data: CreatePaymentMethodRequest) => {
    await paymentMethodsApi.create(data);
    await fetch();
  };

  const remove = async (id: number) => {
    await paymentMethodsApi.remove(id);
    await fetch();
  };

  const select = async (id: number) => {
    await paymentMethodsApi.select(id);
    await fetch();
  };

  return { methods, loading, error, create, remove, select, refetch: fetch };
}
