import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      <header style={styles.header}>
        <h1 style={styles.logo}>Burguer House</h1>
        <nav style={styles.nav}>
          {isAuthenticated ? (
            <>
              <span style={styles.greeting}>Olá, {user?.name}</span>
              <button onClick={logout} style={styles.navButton}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>Login</Link>
              <Link to="/register" style={styles.navLink}>Cadastre-se</Link>
            </>
          )}
        </nav>
      </header>

      <main style={styles.main}>
        <h2>Bem-vindo ao Burguer House</h2>
        <p>Os melhores lanches, pizzas e bebidas da cidade.</p>
        <p style={{ color: '#999', marginTop: '2rem' }}>
          Catálogo de produtos em breve...
        </p>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#e67e22',
    color: '#fff',
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
  },
  nav: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  navButton: {
    background: 'none',
    border: '1px solid #fff',
    color: '#fff',
    padding: '0.4rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  greeting: {
    fontWeight: 'bold',
  },
  main: {
    padding: '2rem',
    textAlign: 'center',
  },
};
