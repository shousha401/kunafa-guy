import { Container } from './Container';

interface SectionProps {
  id: string; // anchor target + aria-labelledby heading id derives from this
  tone: 'light' | 'dark'; // cream-50 | griddle-900
  children: React.ReactNode;
  className?: string;
  labelledBy?: string; // id of the heading inside; defaults to `${id}-heading`
}

export function Section({ id, tone, children, className = '', labelledBy }: SectionProps) {
  const toneCls =
    tone === 'dark'
      ? 'texture-noise bg-griddle-900 text-cream-50'
      : 'bg-cream-50 text-griddle-900';

  return (
    <section
      id={id}
      aria-labelledby={labelledBy ?? `${id}-heading`}
      className={`py-section-y ${toneCls} ${className}`}
    >
      <Container className="relative">{children}</Container>
    </section>
  );
}
