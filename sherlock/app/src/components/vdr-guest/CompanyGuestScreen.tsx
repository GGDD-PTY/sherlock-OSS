'use client'

import { useMemo, useState } from 'react'
import { useQuery } from 'convex/react'
import { useTranslations } from 'next-intl'

import { api } from '@/../convex/_generated/api'
import type { Id } from '@/../convex/_generated/dataModel'
import type { Locale } from '@/i18n/config'
import { Skeleton } from '@/components/ui/skeleton'
import { selectGuestShareableDocuments } from '@/lib/vdr/guest-documents'
import { CompanyGuestPanel } from './CompanyGuestPanel'

const GUEST_NDA_LOCALE = 'es' as const

// La pantalla de invitados carga la lista de la sala por su cuenta: no vive
// dentro del shell de documentos y no comparte su estado. La misma regla de
// elegibilidad que la sala decide qué documentos se pueden compartir.
export function CompanyGuestScreen({
  companyId,
  locale: _locale,
  className,
}: {
  companyId: Id<'companies'>
  locale: Locale
  className?: string
}) {
  const t = useTranslations('vdrGuest')
  const documents = useQuery(api.documents.getByCompany, { companyId })
  const [now] = useState(() => Date.now())
  const shareable = useMemo(
    () => (documents ? selectGuestShareableDocuments(documents, now) : []),
    [documents, now]
  )

  if (documents === undefined) {
    return (
      <div className={className} role="status" aria-busy="true" aria-label={t('panel.loading')}>
        <Skeleton className="h-40 motion-reduce:animate-none" />
      </div>
    )
  }

  return (
    <div className={className}>
      {/* El idioma de la invitación elige la plantilla de NDA que firma el
          invitado, no el idioma de la pantalla: sigue en español aunque el
          equipo use la interfaz en inglés, hasta que exista un NDA en inglés. */}
      <CompanyGuestPanel companyId={companyId} documents={shareable} locale={GUEST_NDA_LOCALE} />
    </div>
  )
}
