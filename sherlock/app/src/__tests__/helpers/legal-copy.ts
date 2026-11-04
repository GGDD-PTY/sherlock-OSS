import es from '@/messages/es.json'

type CopyTree = string | readonly CopyTree[] | { readonly [key: string]: CopyTree }

const flatten = (node: CopyTree): string[] =>
  typeof node === 'string'
    ? [node]
    : Array.isArray(node)
      ? node.flatMap(flatten)
      : Object.values(node as Record<string, CopyTree>).flatMap(flatten)

/**
 * El texto en español de una página legal tal como vive en el diccionario,
 * una línea por mensaje. Los contratos de política leen esto en vez de la
 * página: la página solo pide las llaves.
 */
export function spanishLegalCopy(page: 'terms' | 'privacy' | 'notice'): string {
  return flatten(es.legal[page] as CopyTree).join('\n')
}
