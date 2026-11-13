import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/router/routes';
import { cn } from '@/shared/lib/cn';
import { AlfaMark, Logo, MondrianMosaic } from '@/shared/ui';
import { QUIZ_QUESTIONS } from '@/pages/quiz/quizData';

//Картинка из public/assets (путь /assets/имя-файла). Без src показывается серая заглушка из макета
function Pic({ className, src, alt = '' }: { className?: string; src?: string; alt?: string }) {
  if (src) return <img src={src} alt={alt} className={cn('object-contain', className)} />;
  return <div aria-hidden="true" className={cn('bg-[#d9d9d9]', className)} />;
}

// Заголовок блока: красная квадратная плашка с треугольником-указателем вниз
function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-fit">
      <h2 className="border-4 border-stone-900 bg-brand-600 px-10 py-2 text-center font-display text-2xl font-light text-white shadow-[6px_6px_0_0_#1c1917] sm:text-[28px]">
        {children}
      </h2>
      <span aria-hidden="true" className="absolute -bottom-3 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[10px] border-t-[10px] border-x-transparent border-t-stone-900" />
    </div>
  );
}

const BENEFITS: { text: string; image?: string }[] = [
  { text: 'Получать знания, применяя их на практике', image: '/assets/lander-s1.svg' },
  { text: 'Составить свой идеальный план обучения', image: '/assets/lander-s2.svg' },
  { text: 'Получать реальный профит от своих усилий', image: '/assets/lander-s3.svg' },
];

const STEPS = [
  { title: 'Зарегистрируйтесь', text: 'Это займёт меньше минуты' },
  { title: `Ответьте на ${QUIZ_QUESTIONS.length} вопросов или выберите "быстрый старт"`, text: 'Мы поймём ваши интересы и цели' },
  { title: 'Начните обучение', text: 'Это фундамент вашего пути к успеху' },
];

export function WelcomePage() {
  const navigate = useNavigate();
  const start = () => navigate(ROUTES.REGISTER);

  return (
    <div className="flex min-h-full flex-col bg-white text-black dark:bg-ink-950 dark:text-ink-100">
      <header className="border-b-4 border-brand-950 bg-brand-600 px-6 py-2">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <Logo size="sm" align="left" />
          <Link
            to={ROUTES.LOGIN}
            className="border border-white px-2 py-0.5 font-display text-sm text-white transition-colors hover:bg-white hover:text-brand-600"
          >
            Войти
          </Link>
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden">
        <div className="relative h-56 border-b-4 border-stone-900 md:h-72">
          <MondrianMosaic className="absolute inset-0" />
          <div className="absolute left-8 top-1/2 -translate-y-1/2 border-4 border-stone-900 bg-white p-3 shadow-[8px_8px_0_0_#1c1917] animate-tile-in md:left-16">
            <AlfaMark className="h-20 w-20 md:h-28 md:w-28" />
          </div>
        </div>

        <section className="relative z-10 mx-auto -mt-24 w-full max-w-5xl px-6">
          <div className="grid items-center gap-8 border-4 border-stone-900 bg-white p-8 shadow-[10px_10px_0_0_#1c1917] md:grid-cols-[minmax(0,300px)_1fr] md:p-10">
            <Pic
              src="/assets/lander-main.svg"
              alt=""
              className="mx-auto aspect-[478/635] w-full max-w-[280px]"
            />

            <div>
              <h1 className="font-display text-4xl font-medium leading-tight md:text-5xl">
                Обучение под
                <br />
                <span className="text-shadow-crisp font-bold text-brand-600">ВАШИ</span> стандарты
              </h1>
              <p className="mt-4 max-w-sm font-sans text-lg font-light leading-snug">
                ИИ-наставник поможет вам составить персональную программу по «Альфа-курсам» и разобраться с любыми вопросами
              </p>
              <button
                type="button"
                onClick={start}
                className="text-shadow-black mt-6 border-2 border-brand-950 bg-brand-600 px-6 py-1.5 font-display text-2xl text-white shadow-hard-brand transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-hard-brand-lg"
              >
                Попробовать
              </button>
            </div>
          </div>
        </section>

        <section className="relative mx-auto mt-16 w-full max-w-5xl px-6">
          <SectionTitle>Вам предстоит:</SectionTitle>
          <ul className="mt-12 grid gap-8 sm:grid-cols-3">
            {BENEFITS.map(({ text, image }, i) => (
              <li
                key={text}
                className="flex animate-tile-in flex-col items-center gap-5 border-4 border-stone-900 bg-white p-6 text-center shadow-[6px_6px_0_0_#1c1917] transition-transform duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${300 + i * 150}ms` }}
              >
                <p className="min-h-16 max-w-[14rem] font-display text-2xl font-bold leading-tight text-brand-600">
                  {text}
                </p>
                <Pic src={image} className="aspect-square w-full max-w-[160px]" />
              </li>
            ))}
          </ul>
        </section>

        <section className="relative mx-auto mt-20 w-full max-w-4xl px-6">
          <SectionTitle>Как это работает?</SectionTitle>
          <ol className="mt-10 flex flex-col items-center gap-10">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex flex-col items-center text-center">
                <span className="flex h-12 w-12 items-center justify-center border-4 border-stone-900 bg-white font-display text-3xl leading-none">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-display text-3xl font-medium">{step.title}</h3>
                <p className="font-sans text-base font-light">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <section className="relative mt-24 overflow-hidden bg-brand-600 px-6 py-10 text-center shadow-[inset_0_-6px_0_0_#7b170f]">
        <p className="font-display text-3xl font-light text-white">Готовы начать?</p>
        <button
          type="button"
          onClick={start}
          className="relative mt-3 rounded-xl bg-white px-12 py-2 font-display text-4xl font-medium text-black shadow-hard-brand transition-all hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-hard-brand-lg"
        >
          Попробовать
        </button>
      </section>
    </div>
  );
}
