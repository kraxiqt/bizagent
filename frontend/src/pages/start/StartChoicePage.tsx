import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/router/routes';
import { cn } from '@/shared/lib/cn';
import { Logo } from '@/shared/ui';

interface ChoiceOption {
  id: string;
  title: string;
  text: string;
  // файлы кладутся в public/assets/ (путь в браузере — /assets/имя-файла)
  image: string;
  to: string;
}

const OPTIONS: ChoiceOption[] = [
  {
    id: 'quick',
    title: 'Быстрый старт',
    text: 'Укажите время и цель — и сразу перейдёте в чат с наставником.',
    image: '/assets/start-quick.png',
    to: `${ROUTES.QUIZ}?mode=quick`,
  },
  {
    id: 'quiz',
    title: 'Квиз',
    text: 'Ответьте на несколько вопросов, чтобы мы определили ваш уровень и составили план.',
    image: '/assets/start-quiz.png',
    to: ROUTES.QUIZ,
  },
];

function ChoiceCard({ option, onSelect }: { option: ChoiceOption; onSelect: () => void }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group flex flex-col border-2 border-black bg-white text-left shadow-hard',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-2 hover:bg-brand-50 hover:shadow-[0_14px_0_0_#000]',
        'active:translate-y-1 active:shadow-hard-sm',
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-black bg-brand-50">
        {imageFailed ? (
          <div aria-hidden="true" className="h-full w-full bg-[#d9d9d9]" />
        ) : (
          <img
            src={option.image}
            alt=""
            onError={() => setImageFailed(true)}
            className="h-full w-full object-contain p-4 transition-transform duration-500 ease-out group-hover:-rotate-3 group-hover:scale-110"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h2 className="font-display text-3xl font-medium transition-colors group-hover:text-brand-600">
          {option.title}
        </h2>
        <p className="font-sans text-base font-light leading-snug text-ink-700">{option.text}</p>
        <span className="mt-auto flex items-center gap-2 pt-3 font-display text-xl text-brand-600">
          Начать
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-2"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </button>
  );
}

// Страница после регистрации: быстрый старт (только время и цель) или полный квиз.
export function StartChoicePage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-full flex-col items-center bg-white px-6 py-10 text-black sm:px-10">
      <div className="mb-10 flex justify-center">
        <Logo size="lg" />
      </div>
      <h1 className="mb-10 text-center font-display text-4xl font-medium sm:text-5xl">
        Как начнём?
      </h1>
      <div className="grid w-full max-w-3xl gap-8 sm:grid-cols-2">
        {OPTIONS.map((option) => (
          <ChoiceCard key={option.id} option={option} onSelect={() => navigate(option.to)} />
        ))}
      </div>
    </main>
  );
}
