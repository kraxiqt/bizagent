import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/router/routes';
import { QUIZ_QUESTIONS } from './quizData';

// Чёрно-белый тест: 5 вопросов, в каждом выбирается один вариант.
export function QuizPage() {
  const navigate = useNavigate();
  const total = QUIZ_QUESTIONS.length;

  const [step, setStep] = useState(0);
  // индекс выбранного варианта для каждого вопроса (или null, если не выбран)
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(total).fill(null));
  const [finished, setFinished] = useState(false);

  const question = QUIZ_QUESTIONS[step];
  const selected = answers[step];
  const isLast = step === total - 1;
  const progress = finished ? 100 : (step / total) * 100;

  const selectOption = (index: number) => {
    setAnswers((prev) => prev.map((value, i) => (i === step ? index : value)));
  };

  const next = () => {
    if (selected === null) return;
    if (isLast) {
      setFinished(true);
    } else {
      setStep((s) => s + 1);
    }
  };

  const back = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  if (finished) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center gap-6 bg-white px-6 py-10 text-center text-black">
        <h1 className="text-3xl font-bold uppercase tracking-wide">Готово</h1>
        <p className="max-w-md text-base text-neutral-700">
          Спасибо за ответы. Теперь можно перейти к диалогу с ИИ-ассистентом.
        </p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.CHAT, { replace: true })}
          className="h-12 min-w-[220px] border-2 border-black bg-black px-8 text-base font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
        >
          Перейти в чат
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-full flex-col bg-white px-6 py-10 text-black sm:px-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-neutral-700">
          <span>
            Вопрос {step + 1} из {total}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div
          className="mb-10 h-2 w-full border border-black bg-white"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div className="h-full bg-black transition-all" style={{ width: `${progress}%` }} />
        </div>

        <h1 className="mb-8 text-2xl font-semibold leading-snug sm:text-3xl">{question.text}</h1>

        <div role="radiogroup" aria-label="Варианты ответа" className="flex flex-col gap-3">
          {question.options.map((option, index) => {
            const isChecked = selected === index;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={isChecked}
                onClick={() => selectOption(index)}
                className={`flex items-center gap-4 border-2 px-5 py-4 text-left text-base transition-colors ${
                  isChecked
                    ? 'border-black bg-black text-white'
                    : 'border-black bg-white text-black hover:bg-neutral-100'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    isChecked ? 'border-white' : 'border-black'
                  }`}
                >
                  {isChecked && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="h-11 min-w-[120px] border-2 border-black bg-white px-6 text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Назад
          </button>
          <button
            type="button"
            onClick={next}
            disabled={selected === null}
            className="h-11 min-w-[120px] border-2 border-black bg-black px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-black disabled:hover:text-white"
          >
            {isLast ? 'Завершить' : 'Далее'}
          </button>
        </div>
      </div>
    </main>
  );
}
