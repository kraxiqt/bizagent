//точка доступа к переменным окружениям
export const env = {
  API_URL: (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api').replace(/\/$/, ''),
  // название приложения задано здесь, а не в .env: так его не перебьют старые файлы окружения
  APP_NAME: 'Verity',
  MODE: import.meta.env.MODE,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;
