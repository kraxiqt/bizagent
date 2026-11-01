import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/shared/ui';
import { ROUTES } from '@/app/router/routes';
import type { LoginDto } from '../model/types';

interface LoginFormProps {
  onSubmit: (dto: LoginDto) => void | Promise<void>;
  loading?: boolean;
  //ошибка запроса
  error?: string;
}

export function LoginForm({ onSubmit, loading = false, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {error && (
        <p role="alert" className="bg-white px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Пароль"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className="flex justify-center">
        <Button type="submit" variant="inverted" size="lg" loading={loading} className="px-4 text-2xl">
          Войти
        </Button>
      </div>
      <p className="text-center font-display text-base font-medium text-white/70">
        Нет аккаунта?{' '}
        <Link to={ROUTES.REGISTER} className="font-bold text-white hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </form>
  );
}
