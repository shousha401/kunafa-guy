import type { ProcessStep } from '@/content/site.config';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useInView } from '@/hooks/useInView';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { reveal } from '@/lib/motion';

interface KunafaProcessProps {
  steps: ProcessStep[]; // exactly 4
}

export function KunafaProcess({ steps }: KunafaProcessProps) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLOListElement>(0.15);

  return (
    <Section id="process" tone="dark" labelledBy="process-heading">
      <SectionHeading
        id="process-heading"
        eyebrow="Fresh every single time"
        title="How the Kunafah Happens"
        arabicAccent="كنافة"
        tone="dark"
      />

      <ol
        ref={ref}
        className="relative grid list-none grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
      >
        {/* Connecting drizzle line — desktop only, fully drawn under reduced motion */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 20"
          preserveAspectRatio="none"
          className="pointer-events-none absolute -top-4 left-[12%] hidden h-5 w-[76%] lg:block"
        >
          <path
            d="M0 10 C 80 0, 160 20, 250 10 S 420 0, 500 10 S 670 20, 750 10 S 920 0, 1000 10"
            fill="none"
            stroke="#C9922E"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="1100"
            strokeDashoffset={reduced || inView ? 0 : 1100}
            style={
              reduced
                ? undefined
                : { transition: 'stroke-dashoffset 1200ms cubic-bezier(0.22,1,0.36,1) 200ms' }
            }
          />
        </svg>

        {steps.map((step, i) => (
          <li key={step.n} className="flex flex-col gap-4" style={reveal(inView, reduced, i * 120)}>
            <div className="relative aspect-square overflow-hidden rounded-card bg-griddle-800 shadow-lift">
              <img
                src={step.image.src}
                alt={step.image.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span
                aria-hidden="true"
                className="absolute left-3 top-3 flex h-12 w-12 items-center justify-center rounded-chip bg-kunafa-500 font-display text-2xl font-extrabold text-griddle-950 shadow-griddle-sm"
              >
                {step.n}
              </span>
            </div>
            <div>
              <h3 className="font-display text-2xl font-extrabold tracking-tight text-kunafa-400">
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-cream-100">{step.caption}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
