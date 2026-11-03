'use client'

import { Languages } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { locales, type Locale } from '@/i18n/config'
import { usePathname, useRouter } from '@/i18n/navigation'

// Cada idioma se nombra en su propio idioma: quien no lee español tiene que
// reconocer «English» sin entender el resto de la página.
const LANGUAGE_NAMES = {
  es: 'Español',
  en: 'English',
} satisfies Record<Locale, string>

const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value)

type LanguageToggleProps = {
  readonly triggerId?: string
  readonly showLabel?: boolean
}

/**
 * Selector de idioma. La página es la misma; cambia el prefijo de la URL
 * (`/es/...` ↔ `/en/...`) y con él el diccionario que llena los textos.
 * Conserva la ruta y la query para que el cambio no saque a nadie de donde está.
 */
export function LanguageToggle({
  triggerId = 'sherlock-language-menu-trigger',
  showLabel = false,
}: LanguageToggleProps = {}) {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const t = useTranslations('common.controls.language')
  const current: Locale = isLocale(locale) ? locale : 'es'

  const switchTo = (next: string) => {
    if (!isLocale(next) || next === current) return
    const query = typeof window === 'undefined' ? '' : window.location.search
    startTransition(() => {
      router.replace(`${pathname}${query}`, { locale: next })
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild id={triggerId}>
        <Button
          variant="ghost"
          size={showLabel ? 'sm' : 'icon'}
          className={showLabel ? 'min-h-11' : undefined}
          aria-label={t('toggle')}
          aria-busy={isPending || undefined}
        >
          <Languages className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className={showLabel ? undefined : 'sr-only'}>{LANGUAGE_NAMES[current]}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={current} onValueChange={switchTo}>
          {locales.map((option) => (
            <DropdownMenuRadioItem key={option} value={option} lang={option}>
              {LANGUAGE_NAMES[option]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
