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

// Несколько квадратов разного размера у левого и правого края (вход, выбор пути)
const EDGE_TILES: { side: 'l' | 'r'; top: string; size: number; tone: Tone }[] = [
  { side: 'l', top: '6%', size: 120, tone: 'r' },
  { side: 'l', top: '38%', size: 56, tone: 'y' },
  { side: 'l', top: '74%', size: 96, tone: 'b' },
  { side: 'r', top: '14%', size: 72, tone: 'k' },
  { side: 'r', top: '52%', size: 132, tone: 'w' },
  { side: 'r', top: '86%', size: 44, tone: 'r' },
];

export function EdgeTiles({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {EDGE_TILES.map((t, i) => (
        <span
          key={i}
          className={cn(
            'absolute hidden animate-tile-in border-4 border-stone-900 sm:block',
            FILL[t.tone],
            t.side === 'l' ? 'left-0' : 'right-0',
          )}
          style={{ top: t.top, width: t.size, height: t.size, animationDelay: `${i * 90}ms` }}
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
