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
        // акценты мозаики в духе Мондриана: жёлтый и синий (красный — основной бренд)
        pop: {
          yellow: '#fcd404',
          blue: '#0c7cbf',
        },
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
        // кромка в тон бренду: мягче чёрной, для карточек на светлой странице
        'hard-brand': '0 8px 0 0 #a31f16',
        'hard-brand-lg': '0 14px 0 0 #7b170f',
        'glow-brand': '0 10px 30px -8px rgba(239, 49, 36, 0.45)',
        // чёрная «кромка» снизу, как у карточек и кнопок на макете
        hard: '0 8px 0 0 #000',
        'hard-sm': '0 4px 0 0 #000',
        'inset-hard': 'inset 0 -4px 0 0 #000',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -14px, 0)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'tile-in': {
          '0%': { opacity: '0', transform: 'scale(0.5) rotate(-6deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        draw: {
          '0%': { strokeDashoffset: '400' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        float: 'float 9s ease-in-out infinite',
        'float-slow': 'float 13s ease-in-out infinite reverse',
        'toast-in': 'toast-in 160ms ease-out',
        'tile-in': 'tile-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        draw: 'draw 1.6s ease-out both',
      },
    },
  },
  plugins: [],
};
