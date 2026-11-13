import { Outlet } from 'react-router-dom';
import { GeoDecor, Logo } from '@/shared/ui';

// Белая страница, несколько квадратов по бокам, сверху название, ниже красная карточка (вход / регистрация).
export function AuthLayout() {
  return (
    <main className="relative flex min-h-full flex-col items-center overflow-hidden bg-white px-4 py-10 dark:bg-ink-950">
      <GeoDecor />
      <div className="relative w-full max-w-md">
        <h1 className="mb-10 flex justify-center">
          <Logo size="lg" />
        </h1>
        <div className="bg-brand-600 p-4 shadow-hard-brand-lg ring-1 ring-brand-900/10">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
