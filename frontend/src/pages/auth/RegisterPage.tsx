import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/router/routes';
import { RegisterForm, useRegister } from '@/features/auth';
import type { RegisterDto } from '@/features/auth';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error } = useRegister();

  const handleSubmit = async (dto: RegisterDto) => {
    try {
      await register(dto);
    } catch {
      return; //ошибка уже отображена через error в useRegister
    }
    //сессия уже установлена в useRegister — даём выбрать: быстрый старт или квиз.
    navigate(ROUTES.START, { replace: true });
  };

  return (
    <>
      <h2 className="mb-6 text-center font-display text-5xl font-medium text-white">Регистрация</h2>
      <RegisterForm onSubmit={handleSubmit} loading={loading} error={error} />
    </>
  );
}
