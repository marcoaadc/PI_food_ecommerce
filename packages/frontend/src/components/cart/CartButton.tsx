import { useCart } from '../../hooks/useCart';

interface CartButtonProps {
  onClick: () => void;
}

export function CartButton({ onClick }: CartButtonProps) {
  const { totalItems } = useCart();

  return (
    <button
      onClick={onClick}
      className="relative text-white hover:opacity-80 transition cursor-pointer"
      title="Abrir sacola"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </button>
  );
}
