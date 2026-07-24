import { useState } from 'react';
import type { SiteConfig } from '@/content/site.config';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { buildSmsHref } from '@/lib/sms';
import { PhoneIcon } from '@/components/ui/Icons';

interface CateringProps {
  catering: SiteConfig['catering'];
  contact: SiteConfig['contact'];
}

const FIELD_META: Record<string, { label: string; type: string; placeholder: string; min?: number }> = {
  name: { label: 'Your name', type: 'text', placeholder: 'Sara' },
  date: { label: 'Event date', type: 'date', placeholder: '' },
  city: { label: 'City', type: 'text', placeholder: 'Sacramento' },
  headcount: { label: 'Headcount', type: 'number', placeholder: '50', min: 1 },
};

/**
 * 15-second inquiry → SMS handoff. No backend, no POST, works offline.
 */
export function Catering({ catering, contact }: CateringProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleSend = () => {
    const href = buildSmsHref(contact.smsHrefBase, catering.smsBodyTemplate, values);
    window.location.href = href;
  };

  return (
    <Section id="catering" tone="light" labelledBy="catering-heading">
      <SectionHeading
        id="catering-heading"
        eyebrow="Catering & Events"
        title={catering.headline}
        tone="light"
      />

      <span className="mb-8 inline-flex items-center gap-2 rounded-chip bg-pistachio-500 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-cream-50">
        Serves {catering.serviceArea}
      </span>

      <div className="grid max-w-2xl grid-cols-1 gap-5 min-[480px]:grid-cols-2">
        {catering.fields.map((field) => {
          const meta = FIELD_META[field];
          if (!meta) return null;
          return (
            <div key={field} className="flex flex-col gap-1.5">
              <label htmlFor={`catering-${field}`} className="text-sm font-semibold text-griddle-800">
                {meta.label}
              </label>
              <input
                id={`catering-${field}`}
                type={meta.type}
                min={meta.min}
                placeholder={meta.placeholder}
                value={values[field] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [field]: e.target.value }))}
                className="min-h-[52px] rounded-card border-2 border-griddle-700/25 bg-cream-100 px-4 text-base text-griddle-900 placeholder:text-griddle-700/40 focus:border-kunafa-500 focus:outline-none focus:ring-2 focus:ring-kunafa-300"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex max-w-2xl flex-col items-start gap-4">
        <button
          type="button"
          onClick={handleSend}
          className="inline-flex min-h-[56px] items-center justify-center gap-2.5 rounded-card bg-kunafa-500 px-7 py-3.5 font-display text-lg font-bold tracking-tight text-griddle-950 shadow-griddle transition-all duration-200 ease-griddle hover:bg-kunafa-400 focus-visible:ring-2 focus-visible:ring-pistachio-300 active:translate-y-1 active:shadow-griddle-sm"
        >
          <PhoneIcon className="h-5 w-5" />
          Text Us the Details
        </button>
        <p className="text-sm text-griddle-700">
          or just call{' '}
          <a href={contact.phoneHref} className="font-semibold text-kunafa-600 underline underline-offset-2">
            {contact.phoneDisplay}
          </a>
        </p>
      </div>
    </Section>
  );
}
