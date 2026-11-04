// ============================================================================
// i18n REQUEST HANDLER
// ============================================================================
// Configura next-intl para Server Components
// Este archivo es requerido por next-intl para funcionar con App Router.
// Cada idioma tiene su diccionario; el español es el de referencia y el
// respaldo cuando el segmento de la URL no es un idioma soportado.
// ============================================================================

import { getRequestConfig } from 'next-intl/server'
import { defaultLocale, locales, type Locale } from './config'

const isLocale = (value: string | undefined): value is Locale =>
  value !== undefined && (locales as readonly string[]).includes(value)

const loadMessages = async (locale: Locale) =>
  locale === 'en'
    ? (await import('@/messages/en.json')).default
    : (await import('@/messages/es.json')).default

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = isLocale(requested) ? requested : defaultLocale
  return { locale, messages: await loadMessages(locale) }
})
