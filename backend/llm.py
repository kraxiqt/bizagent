import json
import os

import openai
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

LLM_API_KEY = os.getenv("LLM_API_KEY")
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.groq.com/openai/v1")
LLM_MODEL = os.getenv("LLM_MODEL", "openai/gpt-oss-120b")
# "low" / "medium" / "high"; пусто = параметр не отправляется
LLM_REASONING_EFFORT = os.getenv("LLM_REASONING_EFFORT", "")
LLM_MAX_OUTPUT_TOKENS = int(os.getenv("LLM_MAX_OUTPUT_TOKENS", "8000"))


class LLMUnavailable(Exception):
    """Модель не ответила или вернула мусор."""


_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        if not LLM_API_KEY:
            raise LLMUnavailable("LLM_API_KEY не задан в .env")
        _client = OpenAI(api_key=LLM_API_KEY, base_url=LLM_BASE_URL, timeout=90)
    return _client


def generate_json(system: str, user: str) -> dict:
    """Один запрос к модели, ответ строго JSON."""
    extra = {}
    if LLM_REASONING_EFFORT:
        extra["reasoning_effort"] = LLM_REASONING_EFFORT

    try:
        resp = _get_client().chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            response_format={"type": "json_object"},
            temperature=0.4,
            max_tokens=LLM_MAX_OUTPUT_TOKENS,
            extra_body=extra or None,
        )
        return json.loads(resp.choices[0].message.content or "")
    except json.JSONDecodeError as e:
        raise LLMUnavailable("Модель вернула невалидный JSON") from e
    except openai.OpenAIError as e:
        raise LLMUnavailable(str(e)) from e