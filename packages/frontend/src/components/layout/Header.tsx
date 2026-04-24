import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CartButton } from '../cart/CartButton';
import { CartDrawer } from '../cart/CartDrawer';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="bg-amber-500 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight hover:opacity-90">
            Burguer House
          </Link>

          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium">
                  Olá, {user?.name}
                </span>
                {user?.role === 'SHOPKEEPER' && (
                  <Link
                    to="/shopkeeper/dashboard"
                    className="text-sm bg-white/20 px-3 py-1.5 rounded hover:bg-white/30 transition"
                  >
                    Painel
                  </Link>
                )}
                <CartButton onClick={() => setCartOpen(true)} />
                <button
                  onClick={logout}
                  className="text-sm border border-white px-3 py-1.5 rounded hover:bg-white/20 transition cursor-pointer"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <CartButton onClick={() => setCartOpen(true)} />
                <Link to="/login" className="text-sm hover:underline">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-white text-amber-600 px-3 py-1.5 rounded font-medium hover:bg-amber-50 transition"
                >
                  Cadastre-se
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
