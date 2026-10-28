import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { ChatLayout } from '@/app/layouts/ChatLayout';
import { MainLayout } from '@/app/layouts/MainLayout';
import {
  CallbackPage,
  ChatPage,
  LoginPage,
  NotFoundPage,
  QuizPage,
  RegisterPage,
  WelcomePage,
} from '@/pages';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { ROUTES } from './routes';

export const router = createBrowserRouter([
  // первая страница сайта: вступление с кнопкой «Попробовать»
  { path: ROUTES.ROOT, element: <WelcomePage /> },
  // тест до регистрации: доступен без входа (вошедшего отправляет в чат)
  {
    path: ROUTES.QUIZ,
    element: (
      <PublicOnlyRoute>
        <QuizPage />
      </PublicOnlyRoute>
    ),
  },
  {
    element: (
      <PublicOnlyRoute>
        <AuthLayout />
      </PublicOnlyRoute>
    ),
    children: [
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
      { path: ROUTES.AUTH_CALLBACK, element: <CallbackPage /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        element: <ChatLayout />,
        children: [{ path: ROUTES.CHAT, element: <ChatPage /> }],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
