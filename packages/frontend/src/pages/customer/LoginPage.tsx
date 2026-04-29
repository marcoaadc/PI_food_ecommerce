import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  AuthPageLayout,
  AuthInput,
  AuthSubmitButton,
} from '../../components/layout/AuthPageLayout';

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
      setError('Email ou senha invalidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout title="Burguer House" subtitle="Login" error={error} footer={
      <>
        <p className="text-center text-gray-500 mt-4">
          Nao tem conta? <Link to="/register" className="text-amber-500 hover:underline">Cadastre-se</Link>
        </p>
        <p className="text-center text-gray-500 mt-4">
          <Link to="/shopkeeper/login" className="text-amber-500 hover:underline">Acesso Lojista</Link>
        </p>
      </>
    }>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          type="email"
          placeholder="Email"
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
        <AuthSubmitButton loading={loading} loadingText="Entrando...">
          Entrar
        </AuthSubmitButton>
      </form>
    </AuthPageLayout>
  );
}
