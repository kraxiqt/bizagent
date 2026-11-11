import type { InterestScore } from "./interests";

//Направления из каталога Альфа-Курса, которые пользователь выбирал чаще всего
export function InterestList({ interests }: { interests: InterestScore[] }) {
  if (interests.length === 0) return null;

  return (
    <section aria-label="Ваши интересы" className="mb-10">
      <h2 className="mb-3 font-display text-2xl font-bold">Ваши интересы</h2>
      <ul className="flex flex-wrap gap-2">
        {interests.map((interest) => (
          <li
            key={interest.id}
            className="rounded-[4px] border-2 border-brand-950 bg-brand-600 px-3 py-1 font-display text-lg text-white shadow-inset-hard"
          >
            {interest.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
