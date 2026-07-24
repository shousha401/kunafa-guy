export interface SmsFieldValues {
  [key: string]: string;
}

/**
 * Builds an sms: deep link with a prefilled body.
 * Uses `?&body=` — iOS expects `?&body=`, Android accepts `?body=`;
 * `?&body=` currently works on both, so it's the cross-platform choice.
 * Blank fields render as "—" so the message still reads cleanly.
 */
export function buildSmsHref(
  smsHrefBase: string,
  template: string,
  values: SmsFieldValues,
): string {
  const body = template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const v = values[key]?.trim();
    return v && v.length > 0 ? v : '—';
  });
  return `${smsHrefBase}?&body=${encodeURIComponent(body)}`;
}
