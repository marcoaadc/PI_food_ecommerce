import { useState, type FormEvent } from 'react';
import type { CardBrand, CreatePaymentMethodRequest } from '../../types/payment-method';

interface PaymentMethodFormProps {
  onSubmit: (data: CreatePaymentMethodRequest) => Promise<void>;
  onCancel: () => void;
}

export function PaymentMethodForm({ onSubmit, onCancel }: PaymentMethodFormProps) {
  const [brand, setBrand] = useState<CardBrand>('VISA');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationMonth, setExpirationMonth] = useState('');
  const [expirationYear, setExpirationYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [holderName, setHolderName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        brand,
        cardNumber: cardNumber.replace(/\D/g, ''),
        expirationMonth: parseInt(expirationMonth),
        expirationYear: parseInt(expirationYear),
        cvv,
        holderName,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-gray-800">Novo Cartão</h3>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Bandeira</label>
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value as CardBrand)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
        >
          <option value="VISA">Visa</option>
          <option value="MASTERCARD">Mastercard</option>
          <option value="ELO">Elo</option>
          <option value="AMEX">Amex</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Número do cartão</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="0000 0000 0000 0000"
          maxLength={19}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Mês</label>
          <input
            type="number"
            value={expirationMonth}
            onChange={(e) => setExpirationMonth(e.target.value)}
            placeholder="MM"
            min={1}
            max={12}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Ano</label>
          <input
            type="number"
            value={expirationYear}
            onChange={(e) => setExpirationYear(e.target.value)}
            placeholder="AAAA"
            min={2024}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">CVV</label>
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="123"
            maxLength={4}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Nome no cartão</label>
        <input
          type="text"
          value={holderName}
          onChange={(e) => setHolderName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm bg-amber-500 text-white rounded hover:bg-amber-600 transition cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}
