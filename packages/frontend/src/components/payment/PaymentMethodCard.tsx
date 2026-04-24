import type { PaymentMethod } from '../../types/payment-method';

const brandLabels: Record<string, string> = {
  VISA: 'Visa',
  MASTERCARD: 'Mastercard',
  ELO: 'Elo',
  AMEX: 'Amex',
};

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

export function PaymentMethodCard({ method, onSelect, onDelete }: PaymentMethodCardProps) {
  return (
    <div
      className={`border-2 rounded-lg p-4 cursor-pointer transition ${
        method.isSelected
          ? 'border-amber-500 bg-amber-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(method.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg">💳</span>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {brandLabels[method.brand] ?? method.brand} •••• {method.lastFourDigits}
            </p>
            <p className="text-xs text-gray-500">
              {method.holderName} — {String(method.expirationMonth).padStart(2, '0')}/{method.expirationYear}
            </p>
          </div>
          {method.isSelected && (
            <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
              Selecionado
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(method.id);
          }}
          className="text-gray-400 hover:text-red-500 transition cursor-pointer text-sm"
          title="Remover"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
