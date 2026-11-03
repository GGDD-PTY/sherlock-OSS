// ============================================================================
// TERMS OF SERVICE PAGE
// ============================================================================
// Términos y condiciones del servicio
// Public scope: company-first sell-side preparation with controlled sharing.
// ============================================================================

import type { Metadata } from 'next'
import { Schema } from 'effect'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { buildLocalizedPageMetadata } from '@/lib/site/brand'
import { FileText, Calendar } from 'lucide-react'

// La forma del documento se declara una vez y el texto del diccionario
// (`legal.terms.sections`) se decodifica al renderizar: una sección sin cuerpo,
// un párrafo en blanco o una llave mal escrita revientan en vez de servirse
// como una tarjeta vacía dentro de un contrato.
const NonEmptyTextSchema = Schema.String.pipe(Schema.check(Schema.isNonEmpty()))

const TermsSectionSchema = Schema.Struct({
  title: NonEmptyTextSchema,
  body: Schema.Array(NonEmptyTextSchema).pipe(Schema.check(Schema.isNonEmpty())),
})

const decodeTermsSections = Schema.decodeUnknownSync(Schema.Array(TermsSectionSchema))

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const [t, tTerms] = await Promise.all([
    getTranslations({ locale, namespace: 'terms.meta' }),
    getTranslations({ locale, namespace: 'legal.terms' }),
  ])

  return buildLocalizedPageMetadata({
    locale,
    path: '/terms',
    title: t('title'),
    description: t('description'),
    imageAlt: tTerms('imageAlt'),
  })
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [t, tLegal] = await Promise.all([
    getTranslations({ locale, namespace: 'legal.terms' }),
    getTranslations({ locale, namespace: 'legal' }),
  ])
  const sections = decodeTermsSections(t.raw('sections'))

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* ===== HEADER ===== */}
      <div className="mb-6 max-w-3xl">
        <div className="mb-2 flex items-center gap-3">
          <FileText className="text-primary h-5 w-5 shrink-0" />
          <h1 className="text-2xl font-normal tracking-tight">{t('title')}</h1>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          {t('updated')}
        </div>
        <p className="text-muted-foreground mt-1 text-sm italic">{t('versionNotice')}</p>
        {locale !== 'es' && (
          <p className="text-muted-foreground mt-2 text-sm">{tLegal('translationNotice')}</p>
        )}
      </div>

      {/* ===== CONTENT ===== */}
      <div className="prose prose-sherlock max-w-2xl">
        {sections.map((section) => (
          <Card
            key={section.title}
            className="mb-8 gap-2 rounded-none border-0 bg-transparent py-0 shadow-none"
          >
            <CardHeader className="grid-rows-[auto] gap-0 px-0">
              {/* Titulo de seccion real, no un parrafo con aspecto de titulo: dentro
                  de `main` solo existia el h1 y los once numerales del documento no
                  se podian saltar con lector de pantalla. Las clases repiten lo que
                  daba `CardTitle` (16px, sans, semibold) y ganan por `!` a la regla
                  `.prose-sherlock :is(h1, h2, ...)` de `globals.css`, que si no
                  pintaria el titulo en Fraunces borgona. El texto legal no cambia. */}
              <h2
                data-slot="card-title"
                className="text-card-foreground! font-sans! text-base leading-snug font-semibold tracking-normal"
              >
                {section.title}
              </h2>
            </CardHeader>
            <CardContent className="text-foreground space-y-3 px-0 text-base leading-relaxed">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
