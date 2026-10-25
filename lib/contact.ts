const digits = (v: string) => v.replace(/\D/g, "");

/** Digits for tel:/wa.me links. A bare 10-digit Nepali number gets the +977 country code. */
export function intl(v: string): string {
  const d = digits(v);
  return v.trim().startsWith("+") || d.length > 10 ? d : `977${d}`;
}

export const telHref = (v: string) => `tel:+${intl(v)}`;
export const waHref = (v: string) => `https://wa.me/${intl(v)}`;
