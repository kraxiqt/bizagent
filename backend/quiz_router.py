import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict, Field, ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from db_models import QuizResultDB
from llm import LLMUnavailable, generate_json
from security import get_current_user

router = APIRouter()

# вопросы и темы лежат в одном месте: quiz.json (у каждого вопроса есть поле "topic")
QUESTIONS = json.loads(
    (Path(__file__).parent / "quiz.json").read_text(encoding="utf-8")
)["questions"]
QUESTIONS_BY_ID = {q["id"]: q for q in QUESTIONS}
ORDER = {q["id"]: i for i, q in enumerate(QUESTIONS)}

# q1 («на каком ты этапе») не тема для изучения, а стартовая точка,
# поэтому в слабые/сильные темы он не попадает и идёт в промпт отдельной строкой
STAGE_ID = "q1"


# ---------- схемы ----------
class AnswerIn(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    question_id: str = Field(alias="questionId")
    option_index: int = Field(alias="optionIndex", ge=0, le=3)


class SubmitIn(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    days: Literal[7, 14, 30]
    hours_per_day: float = Field(alias="hoursPerDay", ge=0.25, le=8)
    answers: list[AnswerIn]


class PlanDay(BaseModel):
    day: int
    topic: str
    tasks: list[str]
    result: str
    duration_min: int


class Plan(BaseModel):
    summary: str
    days: list[PlanDay]
    tips: list[str]


# ---------- проверка и диагностика ----------
def validate_answers(answers: list[AnswerIn]) -> list[AnswerIn]:
    """Ровно по одному ответу на каждый вопрос; возвращает ответы в порядке вопросов."""
    ids = [a.question_id for a in answers]
    if len(ids) != len(set(ids)) or set(ids) != set(QUESTIONS_BY_ID):
        raise HTTPException(400, "Ответы не совпадают с вопросами теста")
    return sorted(answers, key=lambda a: ORDER[a.question_id])


def diagnose(answers: list[AnswerIn]) -> dict:
    by_q = {a.question_id: a.option_index for a in answers}  # answers уже отсортированы

    max_score = len(QUESTIONS) * 3
    total = sum(by_q.values())
    ratio = total / max_score
    level = "новичок" if ratio < 0.35 else "средний" if ratio < 0.7 else "продвинутый"

    def topics(match) -> list[str]:
        return [
            QUESTIONS_BY_ID[qid]["topic"]
            for qid, idx in by_q.items()
            if qid != STAGE_ID and match(idx)
        ]

    return {
        "totalScore": total,
        "maxScore": max_score,
        "level": level,
        "stage": QUESTIONS_BY_ID[STAGE_ID]["options"][by_q[STAGE_ID]],
        "weakTopics": topics(lambda i: i <= 1),
        "strongTopics": topics(lambda i: i == 3),
    }


# ---------- промпт ----------
# системный промпт (JSON_SYSTEM_PROMPT) лежит в llm.py и подставляется в generate_json
def build_prompt(data: SubmitIn, answers: list[AnswerIn], diagnosis: dict) -> str:
    qa_lines = []
    for i, a in enumerate(answers, 1):
        q = QUESTIONS_BY_ID[a.question_id]
        qa_lines.append(f"{i}. {q['text']}\n   Ответ: {q['options'][a.option_index]}")
    qa = "\n".join(qa_lines)

    limit = int(data.hours_per_day * 60)
    return f"""Результаты диагностики:
Уровень: {diagnosis['level']} ({diagnosis['totalScore']} из {diagnosis['maxScore']})
Текущий этап: {diagnosis['stage']}
Слабые темы: {', '.join(diagnosis['weakTopics']) or 'нет'}
Сильные темы: {', '.join(diagnosis['strongTopics']) or 'нет'}
Времени в день: {data.hours_per_day} ч.

Ответы пользователя:
{qa}

Составь план обучения ровно на {data.days} дней (по одному объекту на каждый день, day от 1 до {data.days}).
Правила:
- Начинай с текущего этапа пользователя, не давай то, что он уже прошёл.
- Слабые темы ставь в начало плана и возвращайся к ним повторно, сильные темы только закрепляй.
- Сумма duration_min за день не должна превышать {limit} минут.
- Каждый день содержит практическое задание и проверяемый результат.
- Формулируй кратко: 2-4 пункта в tasks, одно предложение в result.

Схема ответа:
{{
  "summary": "вывод об уровне, 2-3 предложения",
  "days": [
    {{"day": 1, "topic": "...", "tasks": ["..."], "result": "...", "duration_min": 60}}
  ],
  "tips": ["..."]
}}"""


# ---------- генерация плана ----------
def generate_plan(prompt: str, days: int) -> Plan:
    for _ in range(2):  # одна повторная попытка при невалидном ответе
        try:
            plan = Plan.model_validate(generate_json(prompt))
            if len(plan.days) != days:
                raise ValueError("Неверное количество дней в плане")
            for i, d in enumerate(plan.days, 1):  # на случай, если модель сбилась с нумерацией
                d.day = i
            return plan
        except (ValidationError, ValueError):
            # ValueError покрывает и json.JSONDecodeError (модель вернула не JSON)
            continue
        except LLMUnavailable as e:
            raise HTTPException(503, f"Модель недоступна: {e}")
    raise HTTPException(502, "Модель вернула некорректный план, попробуйте ещё раз")


# ---------- работа с БД ----------
def latest_row(db: Session, user_id: str) -> QuizResultDB | None:
    return db.scalar(
        select(QuizResultDB)
        .where(QuizResultDB.user_id == user_id)
        .order_by(QuizResultDB.created_at.desc())
        .limit(1)
    )


def quiz_context_for_chat(db: Session, user_id: str) -> str | None:
    'Текст для системного промпта чата: что известно о пользователе по тесту.'

    row = latest_row(db, user_id)
    if not row:
        return None
    d = row.diagnosis or {}
    days = "\n".join(f"День {p['day']}: {p['topic']}" for p in (row.plan or {}).get("days", []))
    return (
        "Профиль пользователя по результатам теста:\n"
        f"Уровень: {d.get('level', '?')}\n"
        f"Текущий этап: {d.get('stage', '?')}\n"
        f"Слабые темы: {', '.join(d.get('weakTopics', [])) or 'нет'}\n"
        f"Сильные темы: {', '.join(d.get('strongTopics', [])) or 'нет'}\n"
        f"Времени в день: {row.hours_per_day} ч.\n"
        f"План обучения на {row.days} дней (темы по дням):\n{days}"
        "\n\nИспользуй эти данные как контекст. Отвечай на конкретный вопрос пользователя, "
        "не пересказывай весь план, если об этом не просили."
    )


# ---------- эндпоинты ----------
@router.get("/quiz")
def get_quiz():
    return QUESTIONS


@router.post("/quiz/submit")
def submit_quiz(
    data: SubmitIn,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    answers = validate_answers(data.answers)

    # защита от спама: не чаще одной генерации в минуту
    last = latest_row(db, str(user.id))
    if last:
        created = last.created_at
        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) - created < timedelta(minutes=1):
            raise HTTPException(429, "Подождите минуту перед повторной генерацией")

    diagnosis = diagnose(answers)
    plan = generate_plan(build_prompt(data, answers, diagnosis), data.days)

    # в БД попадает только успешный результат: ответы + диагностика + готовый план
    db.add(
        QuizResultDB(
            user_id=str(user.id),
            days=data.days,
            hours_per_day=data.hours_per_day,
            answers=[a.model_dump() for a in answers],
            diagnosis=diagnosis,
            plan=plan.model_dump(),
        )
    )
    db.commit()

    return {"diagnosis": diagnosis, "plan": plan}


@router.get("/quiz/latest")
def latest_result(
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = latest_row(db, str(user.id))
    if not row:
        return None
    return {
        "diagnosis": row.diagnosis,
        "plan": row.plan,
        "days": row.days,
        "hoursPerDay": row.hours_per_day,
    }