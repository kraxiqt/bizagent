import type { CSSProperties } from 'react';
import { cn } from '@/shared/lib/cn';

// Тон клетки: w — белый, y — жёлтый, b — синий, r — красный бренд, k — чёрный
type Tone = 'w' | 'y' | 'b' | 'r' | 'k';
// колонка, строка, ширина, высота (сетка 12 × 6, нумерация с 1)
type Cell = [number, number, number, number, Tone];

const CELLS: Cell[] = [
  [1, 1, 2, 1, 'w'], [3, 1, 3, 1, 'y'], [6, 1, 2, 2, 'b'], [8, 1, 1, 1, 'y'], [9, 1, 1, 1, 'k'], [10, 1, 3, 1, 'w'],
  [1, 2, 1, 3, 'w'], [2, 2, 3, 3, 'r'], [5, 2, 1, 1, 'y'], [8, 2, 2, 1, 'w'], [10, 2, 2, 2, 'y'],
  [5, 3, 1, 2, 'w'], [6, 3, 2, 1, 'r'], [8, 3, 2, 1, 'w'],
  [1, 5, 1, 2, 'y'], [2, 5, 2, 1, 'k'], [4, 5, 2, 1, 'b'], [6, 4, 1, 3, 'w'], [7, 4, 1, 2, 'w'],
  [8, 4, 1, 3, 'k'], [9, 4, 2, 2, 'b'], [11, 4, 1, 2, 'y'], [12, 4, 1, 3, 'w'],
  [2, 6, 1, 1, 'w'], [3, 6, 1, 1, 'y'], [4, 6, 1, 1, 'r'], [5, 6, 1, 1, 'k'], [7, 6, 1, 1, 'y'],
  [9, 6, 3, 1, 'w'],
];

const FILL: Record<Tone, string> = {
  w: 'bg-white',
  y: 'bg-pop-yellow',
  b: 'bg-pop-blue',
  r: 'bg-brand-600',
  k: 'bg-stone-900',
};

// Мозаика в духе Мондриана: клетки с чёрной обводкой появляются по очереди.
export function MondrianMosaic({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none grid grid-cols-12 grid-rows-6 border-[3px] border-stone-900 bg-white', className)}
    >
      {CELLS.map(([x, y, w, h, tone], i) => (
        <span
          key={i}
          className={cn('animate-tile-in border-[3px] border-stone-900', FILL[tone])}
          style={{
            gridColumn: `${x} / span ${w}`,
            gridRow: `${y} / span ${h}`,
            animationDelay: `${i * 45}ms`,
          }}
        />
      ))}
    </div>
  );
}

// Красная «А» Альфа-Банка с вращающейся геометрической рамкой.
export function AlfaMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" className={cn('overflow-visible', className)}>
      <g className="animate-tile-in">
        <path d="M60 14 L106 100 L84 100 L60 56 L36 100 L14 100 Z" fill="#ef3124" />
        <rect x="26" y="106" width="68" height="8" fill="#ef3124" />
      </g>
    </svg>
  );
}

const INK = '#1c1917';
const RED = '#ef3124';
const YELLOW = '#fcd404';
const BLUE = '#0c7cbf';

// Геометрический фон входа и выбора пути: по краям разбросаны квадраты, прямоугольники и контурные треугольники.
// Система координат 1976 × 960 (как на макете), на узком экране не показывается.
export function GeoDecor({ className }: { className?: string }) {
  const enter = (i: number): CSSProperties => ({
    transformBox: 'fill-box',
    transformOrigin: 'center',
    animationDelay: `${i * 80}ms`,
  });
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1976 960"
      preserveAspectRatio="xMidYMid slice"
      className={cn('pointer-events-none absolute inset-0 hidden h-full w-full md:block', className)}
    >
      {/* верх слева: красная полоса и белый квадрат с чёрной обводкой */}
      <rect className="animate-tile-in" style={enter(0)} x="-4" y="40" width="322" height="108" fill={RED} />
      <rect className="animate-tile-in" style={enter(0)} x="318" y="40" width="6" height="108" fill={INK} />
      <rect className="animate-tile-in" style={enter(1)} x="329" y="39" width="336" height="237" fill="#fff" stroke={INK} strokeWidth="3" />

      {/* слева: жёлтый квадрат, красный треугольник, синий прямоугольник внизу */}
      <rect className="animate-tile-in" style={enter(2)} x="-2" y="362" width="42" height="62" fill={YELLOW} stroke={INK} strokeWidth="3" />
      <polygon className="animate-tile-in" style={enter(3)} points="344,496 281,537 344,577" fill="none" stroke={RED} strokeWidth="6" strokeLinejoin="miter" />
      <rect className="animate-tile-in" style={enter(4)} x="-2" y="721" width="290" height="150" fill={BLUE} stroke={INK} strokeWidth="3" />

      {/* справа: треугольники, чёрный квадрат, синяя полоса и красная рамка внизу */}
      <polygon className="animate-tile-in" style={enter(5)} points="1461,95 1546,95 1546,162" fill="none" stroke={RED} strokeWidth="6" strokeLinejoin="miter" />
      <rect className="animate-tile-in" style={enter(6)} x="1819" y="122" width="74" height="79" fill={INK} />
      <polygon className="animate-tile-in" style={enter(7)} points="1325,307 1325,377 1396,377" fill="none" stroke={RED} strokeWidth="6" strokeLinejoin="miter" />
      <rect className="animate-tile-in" style={enter(8)} x="1698" y="509" width="195" height="90" fill={BLUE} stroke={INK} strokeWidth="3" />
      <rect className="animate-tile-in" style={enter(9)} x="1199" y="562" width="262" height="278" fill="#fff" stroke={INK} strokeWidth="3" />
      <rect className="animate-tile-in" style={enter(10)} x="1698" y="748" width="195" height="174" fill={INK} />
      <rect className="animate-tile-in" style={enter(11)} x="1716" y="762" width="177" height="146" fill={RED} />

      {/* низ по центру: красный треугольник вверх */}
      <polygon className="animate-tile-in" style={enter(12)} points="636,930 680,891 723,930" fill="none" stroke={RED} strokeWidth="6" strokeLinejoin="miter" />
    </svg>
  );
}
