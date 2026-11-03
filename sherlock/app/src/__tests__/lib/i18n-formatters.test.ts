import { describe, expect, it } from 'vitest'

import { formatMoney, nameAtSentenceEnd } from '@/lib/i18n/formatters'

// El separador que `Intl` mete entre la moneda y la cifra en es-PA es un
// espacio duro (U+00A0), no un espacio normal: pinnearlo evita que el contrato
// se lea como una diferencia invisible.
const NBSP = '\u00a0'

// Las cifras siguen el idioma de la ruta: `es` → es-PA, `en` → en-US. Los dos
// escriben coma de miles, punto decimal y el código `USD` (nunca `$`), para que
// la misma cifra se lea igual en los dos idiomas. Un locale desconocido cae al
// español.
describe('localized money formatting', () => {
  it('formats with the route locale and keeps the currency code', () => {
    expect(formatMoney(2_400_000, { currency: 'USD', locale: 'es' })).toBe(`USD${NBSP}2,400,000`)
    expect(formatMoney(2_400_000, { currency: 'USD', locale: 'en' })).toBe(`USD${NBSP}2,400,000`)
    expect(formatMoney(2_400_000, { currency: 'USD', locale: 'pt' })).toBe(`USD${NBSP}2,400,000`)
  })

  it('provides a compact representation through the same adapter', () => {
    expect(formatMoney(2_400_000, { compact: true, currency: 'USD', locale: 'es' })).toBe(
      `USD${NBSP}2.4${NBSP}M`
    )
    expect(formatMoney(2_400_000, { compact: true, currency: 'USD', locale: 'en' })).toBe(
      `USD${NBSP}2.4M`
    )
  })
})

describe('nameAtSentenceEnd', () => {
  it('quita el último punto de una razón social o Inc.', () => {
    expect(nameAtSentenceEnd('S. A.')).toBe('S. A')
    expect(nameAtSentenceEnd('Inc.')).toBe('Inc')
  })

  it('deja igual un nombre sin punto y la cadena vacía', () => {
    expect(nameAtSentenceEnd('Sample Foods')).toBe('Sample Foods')
    expect(nameAtSentenceEnd('')).toBe('')
  })

  it('quita un solo punto cuando el nombre termina en puntos suspensivos', () => {
    expect(nameAtSentenceEnd('Sample Foods...')).toBe('Sample Foods..')
  })

  it('evalúa roomBody sin duplicar el punto de S. A.', () => {
    const roomBody = (name: string) =>
      `Lo que subas aquí entra al Data Room de ${nameAtSentenceEnd(name)}.`
    const sentence = roomBody('Logística Colón Free Zone, S. A.')
    expect(sentence).toBe(
      'Lo que subas aquí entra al Data Room de Logística Colón Free Zone, S. A.'
    )
    expect(sentence).not.toContain('..')
  })
})
