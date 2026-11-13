// Направления обучения. Названия и состав взяты из каталога платформы «Альфа-Курс» (kurs.alfabank.ru/courses):
// Законы, Финансы, Маркетинг, Технологии, Первые шаги, Управление командой, Маркетплейсы, Продажи, Коммуникации,
// HoReCa, Бизнес за рубежом, Франчайзинг, Регистрация бизнеса, Ретейл, Стиль жизни, Услуги, Лидерство.
// Квиз определяет, какие из них интересны пользователю, чтобы подбирать курсы на этой платформе.

export type InterestId =
  | "start"
  | "registration"
  | "law"
  | "finance"
  | "marketing"
  | "sales"
  | "team"
  | "leadership"
  | "communication"
  | "tech"
  | "marketplaces"
  | "retail"
  | "horeca"
  | "services"
  | "franchise"
  | "abroad"
  | "lifestyle";

// Крупные группы: «предпринимательство», «менеджмент» и т. д.
export type InterestGroup =
  | "entrepreneurship"
  | "management"
  | "sales-marketing"
  | "finance-law"
  | "tech"
  | "personal";

export interface InterestCategory {
  id: InterestId;
  // название как в каталоге Альфа-Курса
  label: string;
  group: InterestGroup;
}

export const INTEREST_GROUP_LABELS: Record<InterestGroup, string> = {
  entrepreneurship: "Предпринимательство",
  management: "Менеджмент",
  "sales-marketing": "Продажи и маркетинг",
  "finance-law": "Финансы и право",
  tech: "Технологии",
  personal: "Личная эффективность",
};

// Порядок важен: при равном счёте выше стоит направление, которое идёт раньше в этом списке.
export const INTEREST_CATEGORIES: InterestCategory[] = [
  { id: "start", label: "Первые шаги", group: "entrepreneurship" },
  { id: "registration", label: "Регистрация бизнеса", group: "entrepreneurship" },
  { id: "franchise", label: "Франчайзинг", group: "entrepreneurship" },
  { id: "abroad", label: "Бизнес за рубежом", group: "entrepreneurship" },
  { id: "marketplaces", label: "Маркетплейсы", group: "entrepreneurship" },
  { id: "retail", label: "Ретейл", group: "entrepreneurship" },
  { id: "horeca", label: "HoReCa", group: "entrepreneurship" },
  { id: "services", label: "Услуги", group: "entrepreneurship" },
  { id: "team", label: "Управление командой", group: "management" },
  { id: "leadership", label: "Лидерство", group: "management" },
  { id: "communication", label: "Коммуникации", group: "management" },
  { id: "marketing", label: "Маркетинг", group: "sales-marketing" },
  { id: "sales", label: "Продажи", group: "sales-marketing" },
  { id: "finance", label: "Финансы", group: "finance-law" },
  { id: "law", label: "Законы", group: "finance-law" },
  { id: "tech", label: "Технологии", group: "tech" },
  { id: "lifestyle", label: "Стиль жизни", group: "personal" },
];

export interface InterestScore extends InterestCategory {
  score: number;
}

// Считает, какие направления выбраны чаще всего. Каждый тег в выбранном варианте даёт +1 к направлению
export function getInterestProfile(
  questions: { interests: InterestId[][] }[],
  answers: (number | null)[],
  top = 3,
): InterestScore[] {
  const scores = new Map<InterestId, number>();
  questions.forEach((question, index) => {
    const chosen = answers[index];
    if (chosen === null || chosen === undefined) return;
    for (const id of question.interests[chosen] ?? []) {
      scores.set(id, (scores.get(id) ?? 0) + 1);
    }
  });

  return INTEREST_CATEGORIES.map((category) => ({ ...category, score: scores.get(category.id) ?? 0 }))
    .filter((category) => category.score > 0)
    .sort((a, b) => b.score - a.score) // сортировка устойчива: порядок списка разрешает ничьи
    .slice(0, top);
}
