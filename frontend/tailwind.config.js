import colors from 'tailwindcss/colors';

//@type {import('tailwindcss').Config}
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // фирменный синий из макета — brand-600 (#0015ff); brand-950 — тёмно-синий для кромок и полей ввода
        brand: {
          50: '#eef0ff',
          100: '#dfe3ff',
          200: '#bfc5ff',
          300: '#8f9aff',
          400: '#5566ff',
          500: '#2a3dff',
          600: '#0015ff',
          700: '#0011cc',
          800: '#000d99',
          900: '#000a73',
          950: '#000756',
        },
        ink: colors.stone,
        navy: '#000756',
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
