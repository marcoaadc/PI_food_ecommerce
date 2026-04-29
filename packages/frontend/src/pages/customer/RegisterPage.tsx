import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  AuthPageLayout,
  AuthInput,
  AuthSubmitButton,
} from '../../components/layout/AuthPageLayout';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ name, email, password });
      navigate('/');
    } catch {
      setError('Erro ao criar conta. Email pode ja estar em uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout title="Burguer House" subtitle="Criar Conta" error={error} footer={
      <p className="text-center text-gray-500 mt-4">
        Ja tem conta? <Link to="/login" className="text-amber-500 hover:underline">Fazer login</Link>
      </p>
    }>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <AuthInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthInput
          type="password"
          placeholder="Senha (minimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <AuthSubmitButton loading={loading} loadingText="Criando...">
          Criar Conta
        </AuthSubmitButton>
      </form>
    </AuthPageLayout>
  );
}
