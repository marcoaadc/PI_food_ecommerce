import { useCallback, useEffect, useState } from 'react';
import { addressesApi } from '../api/addresses.api';
import type { Address, CreateAddressRequest } from '../types/address';

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await addressesApi.getAll();
      setAddresses(data);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status !== 401) {
        setError('Erro ao carregar enderecos');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = async (data: CreateAddressRequest) => {
    await addressesApi.create(data);
    await fetch();
  };

  const update = async (id: number, data: Partial<CreateAddressRequest>) => {
    await addressesApi.update(id, data);
    await fetch();
  };

  const remove = async (id: number) => {
    await addressesApi.remove(id);
    await fetch();
  };

  const select = async (id: number) => {
    await addressesApi.select(id);
    await fetch();
  };

  return { addresses, loading, error, create, update, remove, select, refetch: fetch };
}
