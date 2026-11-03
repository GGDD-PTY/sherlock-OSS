// ============================================================================
// PRIVACY POLICY PAGE
// ============================================================================
// Política de privacidad de la plataforma — Ley 81 de 2019 y Decreto
// Ejecutivo 285 de 2021 (República de Panamá)
// ============================================================================

import type { Metadata } from 'next'
import { Schema } from 'effect'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'
import { buildLocalizedPageMetadata } from '@/lib/site/brand'
import { Shield, Calendar } from 'lucide-react'

// La forma del documento se declara una vez y el texto del diccionario
// (`legal.privacy.sections`) se decodifica al renderizar. Una llave mal escrita
// (`bodyy`) o un campo vacío —una lista sin ítems, un párrafo en blanco—
// revienta en vez de servirse como una tarjeta sin cuerpo dentro de la
// política.
const NonEmptyTextSchema = Schema.String.pipe(Schema.check(Schema.isNonEmpty()))

const PrivacyListItemSchema = Schema.Struct({
  label: Schema.optionalKey(NonEmptyTextSchema),
  text: NonEmptyTextSchema,
})

const PrivacyTableSchema = Schema.Struct({
  headers: Schema.Tuple([NonEmptyTextSchema, NonEmptyTextSchema]),
  rows: Schema.Array(Schema.Tuple([NonEmptyTextSchema, NonEmptyTextSchema])).pipe(
    Schema.check(Schema.isNonEmpty())
  ),
})

const PrivacySectionSchema = Schema.Struct({
  title: NonEmptyTextSchema,
  intro: Schema.optionalKey(NonEmptyTextSchema),
  list: Schema.optionalKey(
    Schema.Array(PrivacyListItemSchema).pipe(Schema.check(Schema.isNonEmpty()))
  ),
  table: Schema.optionalKey(PrivacyTableSchema),
  body: Schema.optionalKey(
    Schema.Array(NonEmptyTextSchema).pipe(Schema.check(Schema.isNonEmpty()))
  ),
})

const decodePrivacySections = Schema.decodeUnknownSync(Schema.Array(PrivacySectionSchema))

// ===== SEO METADATA =====
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const [t, siteMeta] = await Promise.all([
    getTranslations({ locale, namespace: 'privacy.meta' }),
    getTranslations({ locale, namespace: 'site.meta' }),
  ])

  return buildLocalizedPageMetadata({
    locale,
    path: '/privacy',
    title: t('title'),
    description: t('description'),
    imageAlt: siteMeta('imageAlt'),
  })
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [t, tLegal] = await Promise.all([
    getTranslations({ locale, namespace: 'legal.privacy' }),
    getTranslations({ locale, namespace: 'legal' }),
  ])
  const sections = decodePrivacySections(t.raw('sections'))

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* ===== HEADER ===== */}
      <div className="mb-6 max-w-3xl">
        <div className="mb-2 flex items-center gap-3">
          <Shield className="text-primary h-5 w-5 shrink-0" />
          <h1 className="text-2xl font-normal tracking-tight">{t('title')}</h1>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          {t('updated')}
        </div>
        <p className="text-muted-foreground mt-2 text-sm italic">{t('versionNotice')}</p>
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
              {section.intro && <p>{section.intro}</p>}
              {section.list && (
                <ul className="list-disc space-y-2 pl-6">
                  {section.list.map((item) => (
                    <li key={item.label ?? item.text}>
                      {item.label && <strong>{item.label} </strong>}
                      {item.text}
                    </li>
                  ))}
                </ul>
              )}
              {section.table && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        {section.table.headers.map((header) => (
                          <th
                            key={header}
                            className="border-border text-foreground border-b px-3 py-2 text-left font-semibold"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row[0]}>
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex === 0 ? cell : `${row[0]}-${cell}`}
                              className="border-border border-b px-3 py-2 align-top"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {section.body?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
