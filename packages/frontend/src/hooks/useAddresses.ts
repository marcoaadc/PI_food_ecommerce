import { useCallback, useEffect, useState } from 'react';
import { addressesApi } from '../api/addresses.api';
import type { Address, CreateAddressRequest } from '../types/address';

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await addressesApi.getAll();
      setAddresses(data);
    } catch {
      // silently fail — user may not be logged in
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

  return { addresses, loading, create, update, remove, select, refetch: fetch };
}
