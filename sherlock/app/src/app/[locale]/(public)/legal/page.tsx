// ============================================================================
// LEGAL NOTICES PAGE
// ============================================================================
// Avisos importantes y descargos de responsabilidad
// Public scope: company-first sell-side preparation with controlled sharing.
// ============================================================================

import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Schema } from 'effect'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import { buildLocalizedPageMetadata } from '@/lib/site/brand'
import { Info, Calendar } from 'lucide-react'

// TODO: completar razón social tras constitución — mientras tanto, esta página
// se refiere al operador de la Plataforma sin nombrar una entidad específica.
//
// La copia vive en el diccionario (`legal.notice`). Los párrafos llevan
// negritas dentro de la oración (`<b>…</b>`), así que se rinden con `t.rich`;
// la forma del documento (títulos, párrafos, lista) se lee en crudo con
// `t.raw` y se decodifica aquí para no servir una tarjeta vacía.
//
// El título de cada sección es la llave de render (`key={section.title}`): un
// título repetido no lanza, React reutiliza el nodo del primero en silencio.
// `Schema.UniqueArray` decodifica esa garantía de la clave de render.
const NonEmptyTextSchema = Schema.String.pipe(Schema.check(Schema.isNonEmpty()))
const NonEmptyTextListSchema = Schema.Array(NonEmptyTextSchema).pipe(
  Schema.check(Schema.isNonEmpty())
)

const LegalSectionSchema = Schema.Struct({
  title: NonEmptyTextSchema,
  paragraphs: NonEmptyTextListSchema,
  list: Schema.optionalKey(NonEmptyTextListSchema),
})

const decodeLegalSections = Schema.decodeUnknownSync(
  Schema.Array(LegalSectionSchema).pipe(Schema.check(Schema.isNonEmpty()))
)
const decodeLegalSectionTitles = Schema.decodeSync(
  Schema.UniqueArray(NonEmptyTextSchema).pipe(Schema.check(Schema.isNonEmpty()))
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const [t, tNotice] = await Promise.all([
    getTranslations({ locale, namespace: 'legal.meta' }),
    getTranslations({ locale, namespace: 'legal.notice' }),
  ])

  return buildLocalizedPageMetadata({
    locale,
    path: '/legal',
    title: t('title'),
    description: t('description'),
    imageAlt: tNotice('imageAlt'),
  })
}

export default async function LegalNoticesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, tLegal, tLanding] = await Promise.all([
    getTranslations({ locale, namespace: 'legal.notice' }),
    getTranslations({ locale, namespace: 'legal' }),
    getTranslations('landing'),
  ])
  const sections = decodeLegalSections(t.raw('sections'))
  // Revienta al renderizar si dos secciones comparten título, en vez de dejar
  // que el aviso legal salga con una tarjeta duplicada/perdida en producción.
  decodeLegalSectionTitles(sections.map((section) => section.title))
  const rich = { b: (chunks: ReactNode) => <strong>{chunks}</strong> }
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* ===== HEADER ===== */}
      <div className="mb-6 max-w-3xl">
        <div className="mb-2 flex items-center gap-3">
          <Info className="text-primary h-5 w-5 shrink-0" />
          <h1 className="text-2xl font-normal tracking-tight">{t('title')}</h1>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          {t('updated')}
        </div>
        <p className="text-muted-foreground mt-2 text-xs italic">{t('versionNotice')}</p>
        {locale !== 'es' && (
          <p className="text-muted-foreground mt-2 text-sm">{tLegal('translationNotice')}</p>
        )}
      </div>

      {/* ===== CONTENT ===== */}
      <div className="prose prose-sherlock max-w-2xl">
        {sections.map((section, sectionIndex) => (
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
              {section.paragraphs.map((_, paragraphIndex) => (
                <p key={`${sectionIndex}-${paragraphIndex}`}>
                  {t.rich(`sections.${sectionIndex}.paragraphs.${paragraphIndex}`, rich)}
                </p>
              ))}
              {section.list ? (
                <ul className="list-disc space-y-2 pl-6">
                  {section.list.map((_, itemIndex) => (
                    <li key={`${sectionIndex}-${itemIndex}`}>
                      {t.rich(`sections.${sectionIndex}.list.${itemIndex}`, rich)}
                    </li>
                  ))}
                </ul>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* El pie del sitio enlaza aquí una sola vez («Legal»); esta página reúne
          las otras dos salidas legales — «Avisos» es esta misma página. */}
      <nav
        aria-label={tLanding('footer.legal.title')}
        className="mt-6 flex flex-wrap gap-x-6 gap-y-2 pt-2"
      >
        <Link
          href="/privacy"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {tLanding('footer.legal.privacy')}
        </Link>
        <Link
          href="/terms"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {tLanding('footer.legal.terms')}
        </Link>
      </nav>
    </div>
  )
}
