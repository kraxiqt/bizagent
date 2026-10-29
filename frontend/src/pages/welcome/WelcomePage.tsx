import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/router/routes';
import { env } from '@/shared/config/env';

// Чёрно-белая стартовая страница: название, картинка, информация о проекте и кнопка «Попробовать».
export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-full flex-col bg-white px-6 py-10 text-black sm:px-10">
      <h1 className="text-center text-3xl font-bold uppercase tracking-wide sm:text-4xl">
        {env.APP_NAME}
      </h1>

      <div className="mx-auto mt-10 grid w-full max-w-4xl flex-1 items-center gap-8 md:grid-cols-2">
        <div className="overflow-hidden border-2 border-black">
          <img
            src="/assets/cat-bw.jpg"
          />
        </div>

        <section className="border-2 border-black p-6">
          <h2 className="mb-3 text-lg font-semibold uppercase tracking-wide">О проекте</h2>
          <p className="text-base leading-relaxed text-neutral-800">
            Вот такая фигня, собачка
          </p>
        </section>
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-4xl justify-center">
        <button
          type="button"
          onClick={() => navigate(ROUTES.REGISTER)}
          className="h-12 min-w-[220px] border-2 border-black bg-black px-8 text-base font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-black"
        >
          Попробовать
        </button>
      </div>
    </main>
  );
}
