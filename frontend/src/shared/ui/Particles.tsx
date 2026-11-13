import { cn } from '@/shared/lib/cn';

type Shape = 'sparkle' | 'plus' | 'ring' | 'dot' | 'diamond';

interface Particle {
  shape: Shape;
  x: number; // позиция в % по ширине
  y: number; // позиция в % по высоте
  size: number; // px
  delay: number; // задержка анимации, с
  tone: 'strong' | 'soft';
}

const PARTICLES: Particle[] = [
  { shape: 'sparkle', x: 6, y: 12, size: 28, delay: 0, tone: 'strong' },
  { shape: 'plus', x: 18, y: 58, size: 18, delay: 1.2, tone: 'soft' },
  { shape: 'ring', x: 30, y: 22, size: 22, delay: 2.4, tone: 'soft' },
  { shape: 'dot', x: 44, y: 70, size: 10, delay: 0.6, tone: 'strong' },
  { shape: 'diamond', x: 56, y: 14, size: 16, delay: 1.8, tone: 'strong' },
  { shape: 'sparkle', x: 70, y: 46, size: 22, delay: 3.0, tone: 'soft' },
  { shape: 'dot', x: 82, y: 18, size: 12, delay: 0.9, tone: 'soft' },
  { shape: 'ring', x: 92, y: 62, size: 30, delay: 2.1, tone: 'strong' },
  { shape: 'plus', x: 12, y: 88, size: 16, delay: 3.6, tone: 'strong' },
  { shape: 'diamond', x: 88, y: 90, size: 14, delay: 1.5, tone: 'soft' },
  { shape: 'sparkle', x: 50, y: 92, size: 18, delay: 2.8, tone: 'soft' },
];

function ShapeSvg({ shape }: { shape: Shape }) {
  switch (shape) {
    case 'sparkle':
      return <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" fill="currentColor" />;
    case 'plus':
      return <path d="M9.5 0h5v9.5H24v5h-9.5V24h-5v-9.5H0v-5h9.5z" fill="currentColor" />;
    case 'ring':
      return <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" />;
    case 'dot':
      return <circle cx="12" cy="12" r="12" fill="currentColor" />;
    case 'diamond':
      return <path d="M12 0 L24 12 L12 24 L0 12 Z" fill="currentColor" />;
  }
}

// Красные значки и частицы поверх фона. Декор: скрыт от экранных читалок, не перехватывает клики.
export function Particles({ className, density = 'full' }: { className?: string; density?: 'full' | 'light' }) {
  const items = density === 'light' ? PARTICLES.filter((_, i) => i % 2 === 0) : PARTICLES;
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {items.map((p, i) => (
        <span
          key={i}
          className={cn(
            'absolute animate-float',
            p.tone === 'strong' ? 'text-brand-600 opacity-80' : 'text-brand-400 opacity-60',
          )}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
          }}
        >
          <svg viewBox="0 0 24 24" className="h-full w-full">
            <ShapeSvg shape={p.shape} />
          </svg>
        </span>
      ))}
    </div>
  );
}
