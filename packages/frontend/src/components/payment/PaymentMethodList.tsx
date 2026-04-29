import { useState } from 'react';
import { usePaymentMethods } from '../../hooks/usePaymentMethods';
import { PaymentMethodCard } from './PaymentMethodCard';
import { PaymentMethodForm } from './PaymentMethodForm';

export function PaymentMethodList() {
  const { methods, loading, create, select, remove } = usePaymentMethods();
  const [showForm, setShowForm] = useState(false);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="border-2 border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Métodos de Pagamento</h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium cursor-pointer"
          >
            + Novo cartão
          </button>
        )}
      </div>

      {showForm && (
        <PaymentMethodForm
          onSubmit={async (data) => {
            await create(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {methods.length === 0 && !showForm ? (
        <p className="text-gray-400 text-sm text-center py-4">
          Nenhum cartão cadastrado
        </p>
      ) : (
        <div className="space-y-3">
          {methods.map((m) => (
            <PaymentMethodCard
              key={m.id}
              method={m}
              onSelect={select}
              onDelete={remove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
