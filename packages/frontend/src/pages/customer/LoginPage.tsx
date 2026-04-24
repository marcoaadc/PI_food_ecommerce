import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Burguer House</h1>
        <h2 style={styles.subtitle}>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={styles.link}>
          Não tem conta? <Link to="/register">Cadastre-se</Link>
        </p>
        <p style={styles.link}>
          <Link to="/shopkeeper/login">Acesso Lojista</Link>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    color: '#e67e22',
    margin: '0 0 0.5rem',
    fontSize: '1.8rem',
  },
  subtitle: {
    textAlign: 'center',
    color: '#333',
    margin: '0 0 1.5rem',
    fontWeight: 'normal',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#e67e22',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  error: {
    color: '#e74c3c',
    textAlign: 'center',
    margin: '0 0 1rem',
  },
  link: {
    textAlign: 'center',
    marginTop: '1rem',
    color: '#666',
  },
};
