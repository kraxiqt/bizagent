"""
Общий модуль: каталог материалов Альфа-Курса и подбор статей/курсов на день плана.
Используется и «Быстрым стартом» (quickstart_plan.py), и квизом (quiz_router.py).
Лежит отдельно, чтобы не было циклических импортов между ними.
"""
from __future__ import annotations

import json
import re
from functools import lru_cache
from pathlib import Path

CATALOG_PATH = Path(__file__).with_name("alfabank_catalog.json")

TOPIC_THEORY = {
    "idea": "Хорошая идея начинается с проблемы, которую люди решают прямо сейчас. Сравнивайте идеи по трём вопросам: кому это нужно, кто готов платить и что у вас уже есть для старта.",
    "model": "Бизнес-модель отвечает на вопрос, как вы зарабатываете: кто клиент, что он получает, за что платит и из чего складываются расходы. Одна идея может работать как разовая продажа, подписка или комиссия.",
    "demand": "Спрос проверяют до вложений: поговорите с 5–10 потенциальными клиентами (кастдев), соберите минимальную версию продукта (MVP) и посмотрите, готовы ли люди платить или оставить заявку.",
    "plan": "Бизнес-план помогает увидеть всю картину: рынок, продукт, продажи, расходы и сроки выхода на плюс. Достаточно цели, шагов, бюджета и метрик, по которым видно, что вы идёте правильно.",
    "legal": "Прежде чем принимать платежи, выберите формат: самозанятость, ИП или ООО. Он влияет на налоги, отчётность и ответственность. Актуальные условия сверяйте на сайте ФНС и у бухгалтера.",
    "finance": "Разделяйте личные и бизнес-деньги, знайте постоянные и переменные расходы, считайте маржу и точку безубыточности и ведите платёжный календарь, чтобы не ловить кассовые разрывы.",
    "marketing": "Выберите 1–2 канала, где вас найдёт клиент, измеряйте стоимость заявки и конверсию в продажу, а клиентов ведите в простой базе, чтобы возвращать их повторно.",
    "team": "Первые сотрудники нужны там, где вы упираетесь в потолок по времени. Опишите роль и ожидаемый результат и постепенно передавайте повторяемые задачи по инструкциям.",
    "scale": "Масштабировать стоит то, что уже стабильно работает: понятный продукт, повторяемые продажи и положительная экономика на клиента. Рост приносит кризисы, поэтому заранее продумайте процессы и запас прочности.",
    "productivity": "Дисциплина держится на приоритетах и ритме: выбирайте главное на неделю, делите задачи по важности и срочности (матрица Эйзенхауэра) и подводите итоги недели.",
}

# грубое определение темы каталога по тексту (если модель не указала topic_key)
TOPIC_GUESS = [
    (("спрос", "кастдев", "гипотез", "mvp"), "demand"),
    (("идея", "идеи", "идею"), "idea"),
    (("модел",), "model"),
    (("налог", "регистрац", "ип ", "ооо", "самозанят"), "legal"),
    (("финанс", "бюджет", "деньг", "прибыл", "затрат"), "finance"),
    (("клиент", "продаж", "маркетинг", "реклам", "продвиж", "аудитор"), "marketing"),
    (("команд", "сотрудник", "найм"), "team"),
    (("масштаб", "рост", "расширен"), "scale"),
    (("дисциплин", "планирован", "приоритет", "привыч"), "productivity"),
    (("бизнес-план", "стратег", "план"), "plan"),
]


def guess_topic_key(text: str) -> str | None:
    t = (text or "").lower() + " "
    for keys, key in TOPIC_GUESS:
        if any(k in t for k in keys):
            return key
    return None


@lru_cache(maxsize=1)
def load_catalog() -> dict:
    with CATALOG_PATH.open(encoding="utf-8") as f:
        data = json.load(f)
    return {"items": data["items"], "by_id": {i["id"]: i for i in data["items"]}, "topics": data.get("topics", {})}


def public_article(item: dict) -> dict:
    return {"id": item["id"], "title": item["title"], "url": item["url"], "type": item["type"]}


_ORDER = {"article": 0, "term": 1, "course": 2}


def articles_per_day(hours: float) -> int:
    """Сколько материалов в день: 2 при коротких занятиях, 3 при длинных."""
    return 2 if hours <= 1 else 3


def pick_materials(topic: str, wanted_ids: list[str], used: set[str], k: int) -> list[dict]:
    """Набирает k материалов на день: подсказки модели, затем курс по теме (если есть) и статьи.

    Курс добавляется обязательно, когда он есть по теме. Уникальные материалы берутся в первую очередь,
    повторы допускаются только если уникальные закончились (длинный план).
    """
    cat = load_catalog()
    items: list[dict] = []
    for x in wanted_ids:
        it = cat["by_id"].get(x) if isinstance(x, str) else None
        if it and it["id"] not in used and it not in items:
            items.append(it)
    items = items[:k]

    topic_items = [i for i in cat["items"] if i["topic"] == topic]
    if not any(i["type"] == "course" for i in items):
        courses = [i for i in topic_items if i["type"] == "course"]
        course = next((c for c in courses if c["id"] not in used), courses[0] if courses else None)
        if course:
            if len(items) >= k:
                items[-1] = course
            else:
                items.append(course)

    for allow_reuse in (False, True):
        pool = sorted((i for i in topic_items if i not in items and (allow_reuse or i["id"] not in used)),
                      key=lambda i: _ORDER.get(i["type"], 3))
        for it in pool:
            if len(items) >= k:
                break
            if it["type"] != "course":  # курс уже учтён выше, второй не добавляем
                items.append(it)

    items.sort(key=lambda i: _ORDER.get(i["type"], 3))  # статьи, затем курс
    used.update(i["id"] for i in items)
    return [public_article(i) for i in items]


_ID_RE = r"[act]\d{2}"


def strip_ids(text: str) -> str:
    """Убирает внутренние id каталога (a13, c04), если модель упомянула их в тексте."""
    text = re.sub(rf"\b(?:статье|статьи|статью|материалу|материала|курсу|курса)\s+{_ID_RE}\b", "материалам дня", text)
    text = re.sub(rf"\s*\(?\b{_ID_RE}\b\)?", "", text)
    return text.strip()


def catalog_prompt_block() -> str:
    """Текст для промпта: темы и каталог (id | тема | тип | название)."""
    cat = load_catalog()
    topics = "\n".join(f"- {k}: {v}" for k, v in cat["topics"].items())
    lines = "\n".join(f"{i['id']} | {i['topic']} | {i['type']} | {i['title']}" for i in cat["items"])
    return (
        f"Темы каталога:\n{topics}\n\n"
        "Каталог материалов Альфа-Курса (id | тема | тип | название). "
        "Типы: article статья, term термин, course курс. Используй ТОЛЬКО эти id:\n"
        f"{lines}"
    )


def enrich_days(days: list[dict], hours: float) -> None:
    """Добавляет в дни плана (как dict) поля theory, articles и topic_key. Меняет days на месте.

    У каждого дня могут быть topic_key, article_ids, theory от модели; всё проверяется по каталогу.
    """
    cat = load_catalog()
    k = articles_per_day(hours)
    used: set[str] = set()
    for d in days:
        key = d.get("topic_key")
        if not isinstance(key, str) or key not in cat["topics"]:
            key = guess_topic_key(str(d.get("topic") or ""))
        d["topic_key"] = key or ""
        theory = strip_ids(" ".join(str(d.get("theory") or "").split()))[:900]
        if not theory and key:
            theory = TOPIC_THEORY.get(key, "")
        d["theory"] = theory
        d["articles"] = pick_materials(key, (d.pop("article_ids", None) if isinstance(d.get("article_ids"), list) else []), used, k) if key else []
        if isinstance(d.get("tasks"), list):
            d["tasks"] = [strip_ids(t) if isinstance(t, str) else t for t in d["tasks"]]
        if isinstance(d.get("result"), str):
            d["result"] = strip_ids(d["result"])