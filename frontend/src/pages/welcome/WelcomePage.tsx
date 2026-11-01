import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/router/routes';
import { cn } from '@/shared/lib/cn';
import { Logo } from '@/shared/ui';
import { QUIZ_QUESTIONS } from '@/pages/quiz/quizData';

// Серый блок-заглушка из макета. Чтобы вставить картинку, замените <Pic /> на <img src="..." alt="..." />.
function Pic({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('bg-[#d9d9d9]', className)} />;
}

// Синяя «плашка» с чёрной кромкой снизу — заголовок раздела.
function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mx-auto w-fit border-b-4 border-black bg-brand-600 px-10 py-3 text-center font-display text-2xl font-light text-white sm:px-12 sm:text-[28px]">
      {children}
    </h2>
  );
}

const BENEFITS = [
  'Узнать тонкости предпринимательства',
  'Составить свой идеальный бизнес план',
  'Начать купаться в море своих денег',
];

const STEPS = [
  { title: 'Зарегистрируйтесь', text: 'Это займёт меньше минуты' },
  { title: `Ответьте на ${QUIZ_QUESTIONS.length} вопросов`, text: 'Мы поймём ваш уровень и цели' },
  { title: 'Начните обучение', text: 'Это будет ваш путь к успеху' },
];

// Стартовая страница: шапка, вступление с кнопкой «Попробовать», «Вам предстоит», «Как это работает?», синий призыв внизу.
export function WelcomePage() {
  const navigate = useNavigate();
  const start = () => navigate(ROUTES.REGISTER);

  return (
    <div className="flex min-h-full flex-col bg-white text-black">
      <header className="mx-auto flex w-full max-w-6xl items-start justify-between px-6 pt-6">
        <Logo size="sm" align="left" />
        <Link
          to={ROUTES.LOGIN}
          className="border border-navy px-2 py-0.5 font-display text-sm text-navy transition-colors hover:bg-navy hover:text-white"
        >
          Войти
        </Link>
      </header>

      <main className="flex-1">
        <section className="mx-auto mt-10 grid w-full max-w-4xl items-center gap-8 px-6 md:grid-cols-[minmax(0,340px)_1fr]">
          <Pic className="mx-auto aspect-[3/4] w-full max-w-[340px]" />

          <div>
            <h1 className="font-display text-5xl font-medium leading-tight md:text-6xl">
              Обучение под
              <br />
              <span className="text-shadow-blue text-6xl font-bold md:text-7xl">ВАШ</span> бизнес
            </h1>
            <p className="mt-3 max-w-xs font-sans text-2xl font-light leading-snug">
              ИИ-наставник сделает из вас бизнес гения
            </p>
            <button
              type="button"
              onClick={start}
              className="text-shadow-black mt-6 bg-brand-600 px-5 py-1.5 font-display text-3xl text-white transition-colors hover:bg-brand-700"
            >
              Попробовать
            </button>
          </div>
        </section>

        <section className="mx-auto mt-24 w-full max-w-4xl px-6">
          <SectionTitle>Вам предстоит:</SectionTitle>
          <ul className="mt-10 grid gap-10 sm:grid-cols-3">
            {BENEFITS.map((text) => (
              <li key={text} className="flex flex-col items-center gap-6 text-center">
                <p className="min-h-14 max-w-[14rem] font-display text-xl font-light leading-snug">{text}</p>
                <Pic className="aspect-square w-full max-w-[200px]" />
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto mt-24 w-full max-w-4xl px-6">
          <SectionTitle>Как это работает?</SectionTitle>
          <ol className="mt-10 flex flex-col items-center gap-10">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex flex-col items-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black font-display text-3xl leading-none">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-display text-3xl font-medium">{step.title}</h3>
                <p className="font-sans text-base font-light">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <section className="mt-24 bg-brand-600 px-6 py-10 text-center">
        <p className="font-display text-3xl font-light text-white">Готовы начать?</p>
        <button
          type="button"
          onClick={start}
          className="text-shadow-blue mt-3 rounded-xl bg-white px-12 py-2 font-display text-4xl font-medium text-black transition-colors hover:bg-brand-50"
        >
          Попробовать
        </button>
      </section>
    </div>
  );
}
