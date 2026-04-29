import { useState, type FormEvent } from 'react';
import type { AddressType, CreateAddressRequest } from '../../types/address';

interface AddressFormProps {
  onSubmit: (data: CreateAddressRequest) => Promise<void>;
  onCancel: () => void;
}

export function AddressForm({ onSubmit, onCancel }: AddressFormProps) {
  const [postalCode, setPostalCode] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [type, setType] = useState<AddressType>('HOME');
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  const fetchCep = async (cep: string) => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) return;

    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setStreet(data.logradouro || '');
        setDistrict(data.bairro || '');
        setCity(data.localidade || '');
        setState(data.uf || '');
      }
    } catch {
      // ViaCEP offline — user fills manually
    } finally {
      setCepLoading(false);
    }
  };

  const handleCepChange = (value: string) => {
    setPostalCode(value);
    if (value.replace(/\D/g, '').length === 8) {
      fetchCep(value);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        postalCode: postalCode.replace(/\D/g, ''),
        street,
        number,
        complement: complement || undefined,
        district,
        city,
        state,
        type,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-gray-800">Novo Endereço</h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">CEP</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => handleCepChange(e.target.value)}
            placeholder="00000-000"
            maxLength={9}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
          {cepLoading && <p className="text-xs text-amber-500 mt-1">Buscando CEP...</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AddressType)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="HOME">Casa</option>
            <option value="WORK">Trabalho</option>
            <option value="OTHER">Outro</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Rua</label>
        <input
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Número</label>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Complemento</label>
          <input
            type="text"
            value={complement}
            onChange={(e) => setComplement(e.target.value)}
            placeholder="Apto, Bloco..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Bairro</label>
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Cidade</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">UF</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value.toUpperCase())}
            maxLength={2}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>
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
