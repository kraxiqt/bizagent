import colors from 'tailwindcss/colors';

//@type {import('tailwindcss').Config}
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // фирменный красный Альфа-Банка: brand-600 (#EF3124) — основной, brand-700 — при наведении,
        // brand-950 — очень тёмный красно-коричневый для кромок и полей ввода
        brand: {
          50: '#fff1f0',
          100: '#ffe1de',
          200: '#ffc4be',
          300: '#ff9a91',
          400: '#f8665a',
          500: '#f44a3d',
          600: '#ef3124',
          700: '#cf2a1e',
          800: '#a31f16',
          900: '#7b170f',
          950: '#3d0c08',
        },
        ink: colors.stone,
        // тёмный цвет полей на красной карточке и мелких акцентов (название осталось от прежней синей темы)
        navy: '#3d0c08',
      },
      fontFamily: {
        // Inter — основной текст, Iosevka Charon — заголовки, кнопки, подписи.
        // "Jaini Digits" стоит первым: он рисует только цифры (см. @font-face в globals.css).
        sans: [
          '"Jaini Digits"',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        display: [
          '"Jaini Digits"',
          '"Iosevka Charon"',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        // чёрная «кромка» снизу, как у карточек и кнопок на макете
        hard: '0 8px 0 0 #000',
        'hard-sm': '0 4px 0 0 #000',
        'inset-hard': 'inset 0 -4px 0 0 #000',
      },
      keyframes: {
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'toast-in': 'toast-in 160ms ease-out',
      },
    },
  },
  plugins: [],
};
