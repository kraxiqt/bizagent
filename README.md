# Verity

**ИИ-наставник по предпринимательству с персональным планом обучения.**

Verity определяет ваш уровень и цель, составляет план на 7, 14 или 30 дней с теорией, практическими заданиями и материалами из каталога «Альфа-Курсов», а затем сопровождает обучение в чате с ИИ-наставником, который знает ваш план.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-backend-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-compose-2496ed?logo=docker&logoColor=white)

---

## Возможности

- **Два способа начать**
  - **Квиз**: 10 вопросов диагностики определяют уровень (новичок / средний / продвинутый), текущий этап пути, слабые и сильные темы.
  - **Быстрый старт**: достаточно указать цель, срок (7 / 14 / 30 дней) и время в день, без теста.
- **Персональный план обучения**: для каждого дня тема, краткая теория, 2–4 практических задания, проверяемый результат и 2–3 материала из каталога.
- **Каталог «Альфа-Курсов»**: 59 материалов (36 статей, 12 терминов, 11 курсов) по 10 темам: идея, бизнес-модель, спрос, бизнес-план, ИП/ООО/налоги, финансы, клиенты и продвижение, команда, масштабирование, планирование. Если по теме есть курс, он обязательно попадает в день плана.
- **ИИ-наставник в чате**: потоковые ответы, история диалогов, Markdown, копирование и скачивание ответов в `.md`, оценка ответов. Наставник получает контекст вашей диагностики и плана.
- **Панель плана рядом с чатом**: дни выполняются по порядку, в сутки засчитывается один день плана.
- **Серия «огоньков»**: текущая и лучшая серии, предупреждение, если серия под угрозой.
- **Резервный режим**: если ИИ вернул невалидный JSON, план собирается из встроенных шаблонов по темам.
- **Авторизация**: регистрация, вход, JWT access-токены и одноразовые refresh-токены с ротацией.
- Светлая и тёмная темы.

## Как работает наставник

```
Регистрация → Квиз или «Быстрый старт» → План обучения → Чат с наставником + панель плана → Серия
```

1. Пользователь регистрируется и выбирает режим старта.
2. Бэкенд оценивает ответы квиза (каждый вариант даёт 0–3 балла) и формирует диагностику. В режиме «Быстрый старт» порядок тем выбирается по ключевым словам цели.
3. LLM получает диагностику, цель, срок и каталог материалов и возвращает план в строгом JSON (при невалидном ответе делается одна повторная попытка).
4. Ответ проверяется и нормализуется: материалы сверяются с каталогом, выдуманные id отбрасываются, служебные id вырезаются из текста, недостающее подставляется из шаблонов.
5. План сохраняется в БД и подмешивается в системный промпт чата.
6. Ответы чата стримятся клиенту; если провайдер вернул ошибку до первого фрагмента, она приходит обычным HTTP-ответом и ничего не сохраняется. Оборванный ответ (кнопка «Отмена») сохраняется частично.

## Стек

| Часть | Технологии |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Zustand, react-markdown + remark-gfm |
| Backend | Python, FastAPI, SQLAlchemy 2.0, Pydantic 2, PyJWT |
| База данных | PostgreSQL (через psycopg 3) |
| ИИ | Любой OpenAI-совместимый API (по умолчанию Groq, модель `openai/gpt-oss-120b`) |
| Развёртывание | Docker, Docker Compose, nginx |

Фронтенд организован по слоям в духе Feature-Sliced Design: `app`, `pages`, `widgets`, `features`, `entities`, `shared`.

## Структура проекта

```
.
├── Dockerfile              # цели backend и frontend
├── compose.yaml            # db + backend + frontend
├── .dockerignore
├── .env.example            # переменные для Docker Compose
├── backend/
│   ├── main.py             # приложение FastAPI, CORS, авторизация
│   ├── security.py         # хэширование паролей, JWT, текущий пользователь
│   ├── database.py         # подключение к БД (DATABASE_URL), сессии
│   ├── db_models.py        # таблицы SQLAlchemy
│   ├── models.py           # Pydantic-схемы
│   ├── llm.py              # клиент LLM: ответ целиком, стриминг, JSON-режим
│   ├── chat.py             # диалоги, история, потоковый ответ
│   ├── quiz.json           # вопросы диагностики
│   ├── quiz_router.py      # квиз: вопросы, диагностика, генерация плана
│   ├── quickstart_plan.py  # «Быстрый старт» + резервный план
│   ├── materials.py        # подбор материалов на каждый день
│   ├── alfabank_catalog.json  # каталог материалов «Альфа-Курсов»
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── app/            # провайдеры, роутер, layouts
    │   ├── pages/          # welcome, auth, start, quiz, chat
    │   ├── widgets/        # Header
    │   ├── features/       # auth, chat, quiz, streak
    │   ├── entities/       # user
    │   └── shared/         # api-клиент, ui-кит, утилиты, стили
    ├── mock-auth-server.mjs  # мок бэкенда для разработки авторизации
    └── nginx.conf            # раздача сборки и прокси /api на backend
```

## Запуск через Docker (рекомендуется)

Нужны Docker и Docker Compose v2.

```bash
cp .env.example .env
# заполните в .env: LLM_API_KEY, JWT_SECRET, POSTGRES_PASSWORD
docker compose up --build
```

Приложение откроется на <http://localhost:8080> (порт меняется переменной `APP_PORT`).

Состав:

| Сервис | Образ / цель | Описание |
| --- | --- | --- |
| `db` | `postgres:16-alpine` | База данных, данные в томе `verity-pgdata` |
| `backend` | `Dockerfile`, цель `backend` | FastAPI + uvicorn, наружу не публикуется |
| `frontend` | `Dockerfile`, цель `frontend` | nginx: статика Vite и прокси `/api/` на backend |

Таблицы создаются автоматически при старте бэкенда. Полезные команды:

```bash
docker compose logs -f backend      # логи бэкенда
docker compose down                 # остановить, данные сохраняются
docker compose down -v              # остановить и удалить данные БД
```

## Локальный запуск для разработки

Требования: Python 3.10+, Node.js 18+, PostgreSQL (или Docker для него).

### 1. База данных

```bash
docker run -d --name verity-db -p 5432:5432 \
  -e POSTGRES_DB=verity -e POSTGRES_USER=verity -e POSTGRES_PASSWORD=verity \
  postgres:16-alpine
```

> Для быстрой проверки подойдёт и SQLite (`DATABASE_URL=sqlite:///./verity.db`), но каскадное удаление сообщений при удалении диалога рассчитано на внешние ключи БД, а SQLite по умолчанию их не применяет.

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Создайте `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg://verity:verity@localhost:5432/verity
LLM_API_KEY=ваш_ключ
JWT_SECRET=длинная_случайная_строка
```

Запуск:

```bash
uvicorn main:app --reload --port 8000
```

Без `DATABASE_URL` бэкенд не стартует. Документация API: <http://localhost:8000/docs>.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Приложение откроется на <http://localhost:5173>. Dev-сервер проксирует `/api` на `http://127.0.0.1:8000`.

> Чтобы поработать над авторизацией без Python-бэкенда, запустите `node mock-auth-server.mjs` (порт 8000, данные только в памяти).

Проверки и сборка:

```bash
npm run typecheck   # проверка типов
npm run build       # production-сборка в frontend/dist
```

## Конфигурация

### Backend

| Переменная | По умолчанию | Описание |
| --- | --- | --- |
| `DATABASE_URL` | — | **Обязательно.** Строка подключения SQLAlchemy, например `postgresql+psycopg://user:pass@host:5432/db` |
| `LLM_API_KEY` | — | **Обязательно.** Ключ API провайдера |
| `JWT_SECRET` | случайный при старте | Секрет подписи токенов. Задайте постоянный, иначе сессии сбросятся после перезапуска |
| `LLM_BASE_URL` | `https://api.groq.com/openai/v1` | Адрес OpenAI-совместимого API |
| `LLM_MODEL` | `openai/gpt-oss-120b` | Модель |
| `LLM_REASONING_EFFORT` | `low` | `low` / `medium` / `high`; пустое значение отключает параметр |
| `LLM_MAX_OUTPUT_TOKENS` | `4000` | Лимит токенов ответа в чате |
| `LLM_JSON_MAX_OUTPUT_TOKENS` | `12000` | Лимит токенов при генерации плана |
| `LLM_MAX_HISTORY` | `20` | Сколько последних сообщений уходит в модель |
| `ACCESS_TTL_SECONDS` | `900` | Время жизни access-токена |
| `REFRESH_TTL_DAYS` | `30` | Время жизни refresh-токена |

### Docker Compose (`.env` в корне)

`LLM_API_KEY`, `JWT_SECRET` и `POSTGRES_PASSWORD` обязательны, остальные переменные из таблицы выше необязательны. `DATABASE_URL` собирается в `compose.yaml` автоматически. Дополнительно доступна `APP_PORT` (по умолчанию `8080`).

### Frontend (`frontend/.env.local`)

| Переменная | По умолчанию | Описание |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:8000/api` | Базовый адрес API (в production-сборке `/api`) |

## API

| Метод | Путь | Описание |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Регистрация |
| `POST` | `/api/auth/login` | Вход |
| `POST` | `/api/auth/refresh` | Обновление токенов (refresh-токен ротируется) |
| `POST` | `/api/auth/logout` | Выход |
| `GET` | `/api/auth/me` | Текущий пользователь |
| `GET` | `/api/quiz` | Вопросы диагностики |
| `POST` | `/api/quiz/submit` | Отправить ответы и получить диагностику с планом |
| `GET` | `/api/quiz/latest` | Последний сохранённый план |
| `POST` | `/api/quickstart/plan` | План по цели, сроку и времени в день |
| `POST` | `/api/chat/stream` | Потоковый ответ наставника (`text/plain`) |
| `GET` | `/api/chat/conversations` | Список диалогов (постранично) |
| `GET` | `/api/chat/conversations/{id}/messages` | Сообщения диалога (постранично) |
| `DELETE` | `/api/chat/conversations/{id}` | Удалить диалог |

Все эндпоинты, кроме регистрации, входа и обновления токена, требуют заголовок `Authorization: Bearer <accessToken>`. Ошибки приходят в формате `{"message": "..."}`.

## Модель данных

| Таблица | Назначение |
| --- | --- |
| `users` | Пользователи: email (уникальный), имя, хэш пароля |
| `refresh_tokens` | Хэши refresh-токенов со сроком действия |
| `conversations` | Диалоги пользователя (id создаётся на клиенте) |
| `messages` | Сообщения диалога: роль, текст, статус |
| `quiz_results` | Ответы квиза, диагностика и план (JSON), срок и часы в день |

Удаление пользователя или диалога каскадно удаляет связанные записи на уровне БД.

## Безопасность и ограничения

- Пароли хранятся как PBKDF2-HMAC-SHA256 (200 000 итераций, уникальная соль).
- Refresh-токены хранятся в виде SHA-256 хэша и одноразовые.
- Чужой диалог неотличим от несуществующего (ответ 404).
- Длина сообщения в чате ограничена 4000 символами.
- Цель пользователя передаётся в промпт как данные, а не как инструкции; формат ответа модели жёстко задан.
- Юридические и налоговые вопросы наставник разбирает в общих чертах и советует уточнять детали у специалиста.

## Планы по развитию

- Миграции схемы (Alembic) вместо автосоздания таблиц при старте
- Настройка CORS через `CORS_ORIGINS` (сейчас в `main.py` заданы только локальные адреса, в Docker это не мешает: фронтенд и API на одном origin)
- Автотесты для диагностики квиза, подбора материалов, чата и логики серии
- Замена демо-подсказок на стартовом экране чата реальными ответами API

## Участие в разработке

1. Сделайте форк репозитория
2. Создайте ветку: `git checkout -b feature/my-feature`
3. Зафиксируйте изменения: `git commit -m "Add my feature"`
4. Отправьте ветку: `git push origin feature/my-feature`
5. Откройте Pull Request

## Лицензия

Лицензия пока не выбрана. Добавьте файл `LICENSE` (например, MIT) и укажите её здесь.
