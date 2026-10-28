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

QUESTIONS = json.loads(
    (Path(__file__).parent / "quiz.json").read_text(encoding="utf-8")
)["questions"]
QUESTIONS_BY_ID = {q["id"]: q for q in QUESTIONS}

# какую тему проверяет каждый вопрос
TOPICS = {
    "q1": "Этап пути",
    "q2": "Выбор бизнес-идеи",
    "q3": "Целевая аудитория",
    "q4": "Проверка спроса",
    "q5": "Привлечение клиентов",
    "q6": "Продажи",
    "q7": "Финансы",
    "q8": "Оценка рисков",
    "q9": "Планирование и дисциплина",
    "q10": "Рост бизнеса",
}


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


# ---------- диагностика ----------
def diagnose(answers: list[AnswerIn]) -> dict:
    max_score = len(QUESTIONS) * 3
    total = sum(a.option_index for a in answers)
    ratio = total / max_score
    level = "новичок" if ratio < 0.35 else "средний" if ratio < 0.7 else "продвинутый"
    return {
        "totalScore": total,
        "maxScore": max_score,
        "level": level,
        "weakTopics": [TOPICS[a.question_id] for a in answers if a.option_index <= 1],
        "strongTopics": [TOPICS[a.question_id] for a in answers if a.option_index == 3],
    }


# ---------- промпт ----------
# системный промпт (JSON_SYSTEM_PROMPT) лежит в llm.py и подставляется в generate_json
def build_prompt(data: SubmitIn, diagnosis: dict) -> str:
    qa = "\n".join(
        f"{i + 1}. {QUESTIONS_BY_ID[a.question_id]['text']}\n"
        f"   Ответ: {QUESTIONS_BY_ID[a.question_id]['options'][a.option_index]}"
        for i, a in enumerate(data.answers)
    )
    return f"""Результаты диагностики:
Уровень: {diagnosis['level']} ({diagnosis['totalScore']} из {diagnosis['maxScore']})
Слабые темы: {', '.join(diagnosis['weakTopics']) or 'нет'}
Сильные темы: {', '.join(diagnosis['strongTopics']) or 'нет'}
Времени в день: {data.hours_per_day} ч.

Ответы пользователя:
{qa}

Составь план обучения ровно на {data.days} дней (по одному объекту на каждый день).
Сумма duration_min за день не должна превышать {int(data.hours_per_day * 60)} минут.
Каждый день содержит практическое задание и проверяемый результат.
Формулируй кратко: 2-4 пункта в tasks, одно предложение в result.

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
            return plan
        except (ValidationError, ValueError):
            # ValueError покрывает и json.JSONDecodeError (модель вернула не JSON)
            continue
        except LLMUnavailable as e:
            raise HTTPException(503, f"Модель недоступна: {e}")
    raise HTTPException(502, "Модель вернула некорректный план, попробуйте ещё раз")


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
    ids = [a.question_id for a in data.answers]
    if len(ids) != len(QUESTIONS) or set(ids) != set(QUESTIONS_BY_ID):
        raise HTTPException(400, "Ответы не совпадают с вопросами теста")

    # защита от спама: не чаще одной генерации в минуту
    last = db.scalar(
        select(QuizResultDB)
        .where(QuizResultDB.user_id == str(user.id))
        .order_by(QuizResultDB.created_at.desc())
        .limit(1)
    )
    if last:
        created = last.created_at
        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) - created < timedelta(minutes=1):
            raise HTTPException(429, "Подождите минуту перед повторной генерацией")

    diagnosis = diagnose(data.answers)
    plan = generate_plan(build_prompt(data, diagnosis), data.days)

    db.add(
        QuizResultDB(
            user_id=str(user.id),
            days=data.days,
            hours_per_day=data.hours_per_day,
            answers=[a.model_dump() for a in data.answers],
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
    row = db.scalar(
        select(QuizResultDB)
        .where(QuizResultDB.user_id == str(user.id))
        .order_by(QuizResultDB.created_at.desc())
        .limit(1)
    )
    if not row:
        return None
    return {"diagnosis": row.diagnosis, "plan": row.plan}