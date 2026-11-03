import { defaultLocale, locales } from './config'

export { defaultLocale, locales }

export type IntlLocale = 'es-PA' | 'en-US'

/**
 * Locale de `Intl` para cifras y fechas. Los dos usan coma para miles y punto
 * para decimales (`1,234.56`); cambian los nombres de meses y las abreviaturas.
 */
export function getNumberFormatLocale(locale: string): IntlLocale {
  return locale === 'en' ? 'en-US' : 'es-PA'
}
