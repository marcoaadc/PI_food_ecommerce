import type { Address } from '../../types/address';

const typeLabels: Record<string, string> = {
  HOME: 'Casa',
  WORK: 'Trabalho',
  OTHER: 'Outro',
};

const typeIcons: Record<string, string> = {
  HOME: '🏠',
  WORK: '🏢',
  OTHER: '📍',
};

interface AddressCardProps {
  address: Address;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

export function AddressCard({ address, onSelect, onDelete }: AddressCardProps) {
  return (
    <button
      type="button"
      className={`border-2 rounded-lg p-4 cursor-pointer transition w-full text-left ${
        address.isSelected
          ? 'border-amber-500 bg-amber-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      aria-label={`Selecionar endereco: ${address.street}, ${address.number}`}
      aria-pressed={address.isSelected}
      onClick={() => onSelect(address.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-2">
          <span>{typeIcons[address.type] ?? '📍'}</span>
          <span className="text-sm font-medium text-gray-600">
            {typeLabels[address.type] ?? 'Outro'}
          </span>
          {address.isSelected && (
            <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
              Selecionado
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(address.id);
          }}
          className="text-gray-400 hover:text-red-500 transition cursor-pointer text-sm"
          title="Remover"
        >
          ✕
        </button>
      </div>

      <p className="text-gray-800 text-sm">
        {address.street}, {address.number}
        {address.complement && ` - ${address.complement}`}
      </p>
      <p className="text-gray-500 text-sm">
        {address.district}, {address.city} - {address.state}
      </p>
      <p className="text-gray-500 text-sm">CEP: {address.postalCode}</p>
    </button>
  );
}
