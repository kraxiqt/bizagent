import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/router/routes';
import { cn } from '@/shared/lib/cn';
import { EdgeTiles, Logo } from '@/shared/ui';

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
    text: 'Ответьте на несколько вопросов — мы определим ваши интересы и составим план обучения.',
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
        'group relative flex flex-col border-4 border-stone-900 bg-white text-left shadow-[8px_8px_0_0_#1c1917]',
        "after:absolute after:-right-2 after:-top-2 after:h-0 after:w-0 after:bg-pop-yellow after:transition-all after:duration-500 after:content-[''] hover:after:h-16 hover:after:w-16",
        'transition-all duration-300 ease-out',
        'hover:-translate-y-2 hover:shadow-[12px_14px_0_0_#1c1917]',
        'active:translate-y-1 active:shadow-hard-sm',
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-black bg-stone-100">
        {imageFailed ? (
          <div aria-hidden="true" className="h-full w-full bg-[#d9d9d9]" />
        ) : (
          <img
            src={option.image}
            alt=""
            onError={() => setImageFailed(true)}
            className="h-full w-full object-contain p-4"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h2 className="font-display text-3xl font-medium transition-colors group-hover:text-brand-600">
          {option.title}
        </h2>
        <p className="font-sans text-base font-light leading-snug text-ink-700">{option.text}</p>
        <span className="mt-auto flex items-center gap-2 pt-3 font-display text-xl text-brand-600 dark:text-brand-400">
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
    <main className="relative flex min-h-full flex-col items-center overflow-hidden bg-white px-6 py-10 text-black sm:px-10 dark:bg-ink-950 dark:text-ink-100">
      <EdgeTiles />
      <div className="relative mb-10 flex justify-center">
        <Logo size="lg" />
      </div>
      <h1 className="relative mb-10 text-center font-display text-4xl font-medium sm:text-5xl">
        <span className="text-brand-600">Как начнём?</span>
      </h1>
      <div className="relative grid w-full max-w-3xl gap-8 sm:grid-cols-2">
        {OPTIONS.map((option) => (
          <ChoiceCard key={option.id} option={option} onSelect={() => navigate(option.to)} />
        ))}
      </div>
    </main>
  );
}
