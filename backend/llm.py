import json
import os
from collections.abc import Iterator
from datetime import datetime, timezone

import openai
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

LLM_API_KEY = os.getenv("LLM_API_KEY")
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.groq.com/openai/v1")
LLM_MODEL = os.getenv("LLM_MODEL", "openai/gpt-oss-120b")
# "low" / "medium" / "high"; пусто = параметр не отправляется
# gpt-oss — reasoning-модель, "low" заметно быстрее и не съедает все токены на размышления
LLM_REASONING_EFFORT = os.getenv("LLM_REASONING_EFFORT", "low")

# лимит токенов ответа в чате (в него входят и токены «размышлений»)
MAX_OUTPUT_TOKENS = int(os.getenv("LLM_MAX_OUTPUT_TOKENS", "4000"))
# лимит для генерации плана обучения (JSON на 14 дней длинный)
JSON_MAX_OUTPUT_TOKENS = int(os.getenv("LLM_JSON_MAX_OUTPUT_TOKENS", "12000"))
# сколько последних сообщений диалога отправляем в модель
MAX_HISTORY_MESSAGES = int(os.getenv("LLM_MAX_HISTORY", "20"))

# промпт для обычного чата
CHAT_SYSTEM_PROMPT = """Ты — ИИ-наставник по предпринимательству.
Помогаешь с выбором бизнес-идеи, проверкой спроса, поиском целевой аудитории, продажами,
маркетингом, финансами, оценкой рисков, планированием и ростом бизнеса.
Отвечай понятно, по делу и с практическими шагами, на языке пользователя (по умолчанию на русском).
Не выдумывай факты, цифры и ссылки; если чего-то не знаешь, так и скажи.
Юридические и налоговые вопросы разбирай в общих чертах и советуй уточнить детали у специалиста.
Если вопрос не связан с бизнесом, коротко ответь и мягко верни разговор к предпринимательству."""

# промпт для генерации плана обучения (строго JSON)
JSON_SYSTEM_PROMPT = """Ты — наставник по предпринимательству и методист.
Составляешь персональные планы обучения на основе результатов диагностики.
Опирайся только на данные пользователя, не выдумывай факты о нём.
Фокусируйся на слабых темах, сильные закрепляй кратко.
Сложность заданий соответствует уровню пользователя.
Пиши на русском языке.
Отвечай строго валидным JSON по заданной схеме, без пояснений и без markdown."""


class LLMUnavailable(Exception):
    """Модель не ответила; текст можно показать пользователю."""


_client: OpenAI | None = None


def get_client() -> OpenAI:
    global _client
    if _client is None:
        if not LLM_API_KEY:
            raise LLMUnavailable("ИИ не настроен: задай LLM_API_KEY в файле .env")
        _client = OpenAI(api_key=LLM_API_KEY, base_url=LLM_BASE_URL)
    return _client


def build_system_prompt(base: str = CHAT_SYSTEM_PROMPT, extra_system: str | None = None) -> str:
    today = datetime.now(timezone.utc).strftime("%d.%m.%Y")
    prompt = (
        f"{base}\n"
        f"Сегодняшняя дата: {today} (UTC). Ты не знаешь событий после окончания своего обучения "
        "и не должен выдумывать свежие новости, даты и ссылки."
    )
    if extra_system:
        prompt += "\n\n" + extra_system
    return prompt


def build_messages(
    history: list[dict],
    extra_system: str | None = None,
    base: str = CHAT_SYSTEM_PROMPT,
) -> list[dict]:
    """history: [{"role": "user" | "assistant", "content": "..."}, ...]"""
    system = {"role": "system", "content": build_system_prompt(base, extra_system)}
    return [system, *history]


def _params(
    history: list[dict],
    stream: bool,
    extra_system: str | None = None,
    base: str = CHAT_SYSTEM_PROMPT,
    max_tokens: int | None = None,
) -> dict:
    params = {
        "model": LLM_MODEL,
        "messages": build_messages(history, extra_system, base),
        "max_tokens": max_tokens or MAX_OUTPUT_TOKENS,
        "stream": stream,
    }
    if LLM_REASONING_EFFORT:
        params["extra_body"] = {"reasoning_effort": LLM_REASONING_EFFORT}
    return params


def _to_unavailable(err: Exception) -> LLMUnavailable:
    if isinstance(err, openai.RateLimitError):
        return LLMUnavailable("Слишком много запросов к ИИ, подождите минуту и повторите")
    if isinstance(err, openai.AuthenticationError):
        return LLMUnavailable("Неверный ключ API для ИИ (проверь LLM_API_KEY)")
    return LLMUnavailable("Сервис ИИ временно недоступен")


def ask_llm(
    history: list[dict],
    extra_system: str | None = None,
    base: str = CHAT_SYSTEM_PROMPT,
    max_tokens: int | None = None,
) -> str:
    """Ответ целиком."""
    try:
        resp = get_client().chat.completions.create(
            **_params(history, False, extra_system, base, max_tokens)
        )
    except openai.OpenAIError as err:
        raise _to_unavailable(err) from err
    return resp.choices[0].message.content or ""


def stream_llm(history: list[dict], extra_system: str | None = None) -> Iterator[str]:
    """Ответ по частям (для потоковой выдачи во фронт)."""
    try:
        stream = get_client().chat.completions.create(**_params(history, True, extra_system))
        for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
    except openai.OpenAIError as err:
        raise _to_unavailable(err) from err


def _extract_json(text: str) -> dict:
    """Достаёт JSON-объект из ответа модели (убирает ```json ... ``` и лишний текст)."""
    text = text.strip()
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end <= start:
        raise ValueError("В ответе модели нет JSON-объекта")
    return json.loads(text[start : end + 1])  # JSONDecodeError — подкласс ValueError


def generate_json(prompt: str, base: str = JSON_SYSTEM_PROMPT) -> dict:
    """Просит модель вернуть JSON. Бросает LLMUnavailable или ValueError (невалидный JSON)."""
    text = ask_llm(
        [{"role": "user", "content": prompt}],
        base=base,
        max_tokens=JSON_MAX_OUTPUT_TOKENS,
    )
    return _extract_json(text)