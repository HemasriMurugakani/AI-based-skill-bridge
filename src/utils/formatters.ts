/**
 * Formatting utilities using the native ECMAScript Internationalization API (Intl).
 * Supports English (en), Tamil (ta), French (fr), and Hindi (hi).
 */

import { Language } from '../types';

export const LOCALE_MAP: Record<Language, string> = {
  en: 'en-IN',
  ta: 'ta-IN',
  fr: 'fr-FR',
  hi: 'hi-IN',
};

/**
 * Format a Date object, ISO string, or timestamp into a localized date string.
 */
export function formatDate(
  date: Date | string | number,
  lang: Language = 'en',
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const locale = LOCALE_MAP[lang] || 'en-IN';
    return new Intl.DateTimeFormat(locale, options).format(d);
  } catch (e) {
    return String(date);
  }
}

/**
 * Format a relative elapsed time (e.g., "2 days ago", "hier", "2 நாட்கள் முன்பு").
 */
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  lang: Language = 'en'
): string {
  try {
    const locale = LOCALE_MAP[lang] || 'en-IN';
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    return rtf.format(value, unit);
  } catch (e) {
    return `${value} ${unit}`;
  }
}

/**
 * Format numbers with localized separators and digits.
 */
export function formatNumber(
  value: number,
  lang: Language = 'en',
  options?: Intl.NumberFormatOptions
): string {
  try {
    const locale = LOCALE_MAP[lang] || 'en-IN';
    return new Intl.NumberFormat(locale, options).format(value);
  } catch (e) {
    return String(value);
  }
}

/**
 * Format a ratio (0 to 1) or percentage (0 to 100) into a localized percent string.
 */
export function formatPercent(
  value: number,
  lang: Language = 'en',
  isRatio: boolean = false
): string {
  try {
    const locale = LOCALE_MAP[lang] || 'en-IN';
    const num = isRatio ? value : value / 100;
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      maximumFractionDigits: 1,
    }).format(num);
  } catch (e) {
    return `${value}%`;
  }
}

/**
 * Format currency amounts with localized symbol and group formatting.
 */
export function formatCurrency(
  value: number,
  lang: Language = 'en',
  currency: string = 'INR'
): string {
  try {
    const locale = LOCALE_MAP[lang] || 'en-IN';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch (e) {
    return `₹${value}`;
  }
}

/**
 * Plural formatting using Intl.PluralRules.
 */
export function formatPlural(
  count: number,
  lang: Language = 'en',
  forms: { one: string; other: string; zero?: string }
): string {
  try {
    const locale = LOCALE_MAP[lang] || 'en-IN';
    const pr = new Intl.PluralRules(locale);
    const rule = pr.select(count);

    if (count === 0 && forms.zero) return forms.zero;
    if (rule === 'one') return forms.one;
    return forms.other;
  } catch (e) {
    return count === 1 ? forms.one : forms.other;
  }
}
