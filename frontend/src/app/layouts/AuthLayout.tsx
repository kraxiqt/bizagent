import { Outlet } from 'react-router-dom';
import { Logo } from '@/shared/ui';

// Белая страница, сверху название, ниже синяя карточка с чёрной кромкой (вход / регистрация).
export function AuthLayout() {
  return (
    <main className="flex min-h-full flex-col items-center bg-white px-4 py-10">
      <div className="w-full max-w-md">
        <h1 className="mb-10 flex justify-center">
          <Logo size="lg" />
        </h1>
        <div className="bg-brand-600 p-4 shadow-hard">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
