import type { ReactNode } from 'react';

interface AuthPageLayoutProps {
  title: string;
  subtitle: string;
  error?: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: 'customer' | 'shopkeeper';
}

export function AuthPageLayout({
  title,
  subtitle,
  error,
  children,
  footer,
  variant = 'customer',
}: AuthPageLayoutProps) {
  const bgClass = variant === 'shopkeeper' ? 'bg-[#2c3e50]' : 'bg-gray-100';
  const buttonBgClass =
    variant === 'shopkeeper'
      ? 'bg-[#2c3e50] hover:bg-[#1a252f]'
      : 'bg-amber-500 hover:bg-amber-600';

  return (
    <div className={`flex items-center justify-center min-h-screen ${bgClass}`}>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-[400px]">
        <h1 className="text-center text-amber-500 text-3xl font-bold mb-2">
          {title}
        </h1>
        <h2 className="text-center text-gray-800 text-lg font-normal mb-6">
          {subtitle}
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <div
          className="flex flex-col gap-4"
          data-button-variant={buttonBgClass}
        >
          {children}
        </div>

        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
}

export function AuthInput({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3 py-3 border border-gray-300 rounded text-base focus:outline-none focus:border-amber-500"
    />
  );
}

export function AuthSubmitButton({
  loading,
  loadingText,
  children,
  variant = 'customer',
}: {
  loading: boolean;
  loadingText: string;
  children: ReactNode;
  variant?: 'customer' | 'shopkeeper';
}) {
  const bgClass =
    variant === 'shopkeeper'
      ? 'bg-[#2c3e50] hover:bg-[#1a252f]'
      : 'bg-amber-500 hover:bg-amber-600';

  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full px-3 py-3 ${bgClass} text-white border-none rounded text-base cursor-pointer transition disabled:opacity-50`}
    >
      {loading ? loadingText : children}
    </button>
  );
}
