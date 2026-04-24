import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function ShopkeeperLayout() {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: '/shopkeeper/dashboard', label: 'Produtos' },
    { to: '/shopkeeper/orders', label: 'Pedidos' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/shopkeeper/dashboard" className="text-xl font-bold tracking-tight">
            Burguer House <span className="text-amber-400 text-sm font-normal ml-2">Painel</span>
          </Link>

          <nav className="flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm px-3 py-1.5 rounded transition ${
                  location.pathname === item.to
                    ? 'bg-white/20 font-medium'
                    : 'hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={logout}
              className="text-sm border border-white/30 px-3 py-1.5 rounded hover:bg-white/10 transition cursor-pointer"
            >
              Sair
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
