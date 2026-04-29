import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  AuthPageLayout,
  AuthInput,
  AuthSubmitButton,
} from '../../components/layout/AuthPageLayout';

export function ShopkeeperLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ email, password });

      if (user.role !== 'SHOPKEEPER') {
        await logout();
        setError('Acesso restrito a lojistas');
        return;
      }

      navigate('/shopkeeper/dashboard');
    } catch {
      setError('Credenciais invalidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout
      title="Burguer House"
      subtitle="Painel do Lojista"
      error={error}
      variant="shopkeeper"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          type="email"
          placeholder="Email do lojista"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthInput
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <AuthSubmitButton loading={loading} loadingText="Entrando..." variant="shopkeeper">
          Entrar
        </AuthSubmitButton>
      </form>
    </AuthPageLayout>
  );
}
