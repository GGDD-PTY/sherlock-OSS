// ============================================================================
// MONEDAS SOPORTADAS
// ============================================================================
// Fuente única de verdad para monedas en toda la aplicación
// Usado en: la ficha de la empresa y el análisis financiero
// ============================================================================

import { Schema } from 'effect'

import type { Locale } from '@/i18n/config'

// ===== MONEDAS DISPONIBLES =====
// Cada moneda tiene: value (código ISO), label (descripción ES), labelEn (descripción EN), symbol
export const CURRENCIES = [
  { value: 'USD', label: 'USD - Dólar Estadounidense', labelEn: 'USD - US Dollar', symbol: '$' },
  { value: 'MXN', label: 'MXN - Peso Mexicano', labelEn: 'MXN - Mexican Peso', symbol: '$' },
  { value: 'COP', label: 'COP - Peso Colombiano', labelEn: 'COP - Colombian Peso', symbol: '$' },
  { value: 'PEN', label: 'PEN - Sol Peruano', labelEn: 'PEN - Peruvian Sol', symbol: 'S/' },
  { value: 'CLP', label: 'CLP - Peso Chileno', labelEn: 'CLP - Chilean Peso', symbol: '$' },
  { value: 'ARS', label: 'ARS - Peso Argentino', labelEn: 'ARS - Argentine Peso', symbol: '$' },
  { value: 'BRL', label: 'BRL - Real Brasileño', labelEn: 'BRL - Brazilian Real', symbol: 'R$' },
] as const

// ===== TIPO DERIVADO =====
// El vocabulario sale de `CURRENCIES` y el tipo sale del schema, no de un
// `[number]['value']` paralelo.
const CurrencyCodeSchema = Schema.Literals(CURRENCIES.map((currency) => currency.value))
export type CurrencyCode = typeof CurrencyCodeSchema.Type

const isCurrencyCode = Schema.is(CurrencyCodeSchema)

// ===== HELPER: Obtener la descripción de una moneda =====
// `es` por defecto; un código desconocido se devuelve tal cual.
export function getCurrencyLabel(code: string, locale: Locale = 'es'): string {
  const currency = CURRENCIES.find((c) => c.value === code)
  if (!currency) return code
  return locale === 'en' ? currency.labelEn : currency.label
}

// ===== HELPER: Validar si es una moneda válida =====
export function isValidCurrency(code: string): code is CurrencyCode {
  return isCurrencyCode(code)
}
