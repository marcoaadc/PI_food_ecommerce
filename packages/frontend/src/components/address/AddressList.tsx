import { useState } from 'react';
import { useAddresses } from '../../hooks/useAddresses';
import { AddressCard } from './AddressCard';
import { AddressForm } from './AddressForm';

export function AddressList() {
  const { addresses, loading, create, select, remove } = useAddresses();
  const [showForm, setShowForm] = useState(false);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="border-2 border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Endereços de Entrega</h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium cursor-pointer"
          >
            + Novo endereço
          </button>
        )}
      </div>

      {showForm && (
        <AddressForm
          onSubmit={async (data) => {
            await create(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {addresses.length === 0 && !showForm ? (
        <p className="text-gray-400 text-sm text-center py-4">
          Nenhum endereço cadastrado
        </p>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onSelect={select}
              onDelete={remove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
