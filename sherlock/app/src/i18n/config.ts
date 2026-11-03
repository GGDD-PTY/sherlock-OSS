// ============================================================================
// CONFIGURACIÓN DE INTERNACIONALIZACIÓN (i18n)
// ============================================================================
// Define los idiomas soportados y el idioma por defecto (español)
// Usado por next-intl y el middleware de routing
// ============================================================================

export const locales = ['es', 'en'] as const
export const defaultLocale = 'es' as const

export type Locale = (typeof locales)[number]
