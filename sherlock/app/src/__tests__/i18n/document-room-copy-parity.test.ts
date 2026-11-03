import { describe, expect, it } from 'vitest'

import { activityCopy } from '@/components/company/data-room-activity/copy'
import { VDR_ACCESS_LEVELS, VDR_CLASSIFICATIONS, VDR_COPY } from '@/components/company/vdr/config'
import { ROOM_SHELL_COPY } from '@/components/documents/shell/copy'
import { getVdrFolderLabel, getVdrShellFolderLabel } from '@/lib/vdr/document-taxonomy'

// ============================================================================
// CANDADO: CADA DICCIONARIO DE LA SALA TIENE `en` CON LAS MISMAS CLAVES QUE `es`
// ============================================================================
// Estos módulos guardan su propio copy por idioma (no viven en `messages/*.json`).
// Una clave que exista solo en `es` se vería como `undefined` en inglés.

type Tree = { [key: string]: unknown }

function shape(value: unknown): unknown {
  if (typeof value === 'function') return 'function'
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value as Tree)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, shape(child)])
    )
  }
  return typeof value
}

describe('document room copy dictionaries', () => {
  it.each([
    ['shell/copy.ts', ROOM_SHELL_COPY],
    ['vdr/config.ts', VDR_COPY],
    ['data-room-activity/copy.ts', activityCopy],
  ])('%s: en has the same keys and value kinds as es', (_name, copy) => {
    expect(Object.keys(copy).sort()).toEqual(['en', 'es'])
    expect(shape(copy.en)).toEqual(shape(copy.es))
  })

  it.each([
    ['shell/copy.ts', ROOM_SHELL_COPY],
    ['vdr/config.ts', VDR_COPY],
    ['data-room-activity/copy.ts', activityCopy],
  ])('%s: en has no empty strings', (_name, copy) => {
    const empty: string[] = []
    const walk = (value: unknown, path: string) => {
      if (typeof value === 'string' && value.trim() === '') empty.push(path)
      if (typeof value === 'object' && value !== null) {
        for (const [key, child] of Object.entries(value as Tree)) walk(child, `${path}.${key}`)
      }
    }
    walk(copy.en, 'en')
    expect(empty).toEqual([])
  })

  it('labels every access level and classification in both languages', () => {
    for (const option of [...VDR_ACCESS_LEVELS, ...VDR_CLASSIFICATIONS]) {
      expect(option.label.en.trim()).not.toBe('')
      expect(option.description.en.trim()).not.toBe('')
      expect(option.label.en).not.toBe('')
    }
  })

  it('names the five shell folders in English with the process numbering', () => {
    expect(
      ['room_legal', 'room_corporate', 'room_financial', 'room_operations', 'room_marketing'].map(
        (folder) => getVdrShellFolderLabel(folder, 'en')
      )
    ).toEqual([
      '1. Legal',
      '2. Corporate',
      '3. Financial',
      '4. Operations',
      '5. Marketing Materials',
    ])
    expect(getVdrFolderLabel('other', 'en')).toBe('Other')
  })
})
