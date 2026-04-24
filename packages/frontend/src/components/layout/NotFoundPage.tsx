import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-2">404</h1>
        <p className="text-gray-500 mb-6">Página não encontrada</p>
        <Link
          to="/"
          className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
