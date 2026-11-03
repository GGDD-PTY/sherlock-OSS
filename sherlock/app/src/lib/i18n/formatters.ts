import { getNumberFormatLocale } from '@/i18n/routing'

type MoneyFormatOptions = {
  readonly compact?: boolean
  readonly currency: string
  readonly locale: string
}

// Las cifras siguen el idioma de la ruta (`es` → es-PA, `en` → en-US). Los dos
// escriben `USD 1,234`: el inglés muestra el código de moneda, no `$`, para que
// una cifra signifique lo mismo en los dos idiomas.

const moneyFormatters = new Map<string, Intl.NumberFormat>()

export function formatMoney(
  amount: number,
  { compact = false, currency, locale }: MoneyFormatOptions
): string {
  const intlLocale = getNumberFormatLocale(locale)
  const cacheKey = `${intlLocale}:${currency}:${compact ? 'compact' : 'standard'}`
  let formatter = moneyFormatters.get(cacheKey)

  if (!formatter) {
    formatter = new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency,
      ...(intlLocale === 'en-US' ? { currencyDisplay: 'code' as const } : {}),
      ...(compact ? { notation: 'compact', maximumFractionDigits: 1 } : {}),
      ...(compact ? {} : { maximumFractionDigits: 0 }),
    })
    moneyFormatters.set(cacheKey, formatter)
  }

  return formatter.format(amount)
}

// Las razones sociales panameñas suelen terminar en «S. A.» o «Inc.»: la
// plantilla conserva su punto final; este helper quita el del nombre.
export function nameAtSentenceEnd(name: string): string {
  return name.endsWith('.') ? name.slice(0, -1) : name
}
