import { parse, TYPE } from '@formatjs/icu-messageformat-parser'
import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser'
import { describe, expect, it } from 'vitest'

import enMessages from '@/messages/en.json'
import esMessages from '@/messages/es.json'

type Leaf = { path: string; value: unknown }

/** Flattens a message tree into dotted key paths. Arrays use their index as the segment. */
function flatten(node: unknown, prefix: string[] = []): Leaf[] {
  if (Array.isArray(node)) {
    return node.flatMap((child, index) => flatten(child, [...prefix, String(index)]))
  }
  if (node !== null && typeof node === 'object') {
    return Object.entries(node).flatMap(([key, child]) => flatten(child, [...prefix, key]))
  }
  return [{ path: prefix.join('.'), value: node }]
}

type MessageSignature = { args: string[]; tags: string[] }

/** Collects argument names and rich-text tag names, descending into plural/select branches and tag children. */
function collect(elements: MessageFormatElement[], args: Set<string>, tags: Set<string>): void {
  for (const element of elements) {
    switch (element.type) {
      case TYPE.literal:
      case TYPE.pound:
        break
      case TYPE.argument:
      case TYPE.number:
      case TYPE.date:
      case TYPE.time:
        args.add(element.value)
        break
      case TYPE.select:
      case TYPE.plural:
        args.add(element.value)
        for (const option of Object.values(element.options)) {
          collect(option.value, args, tags)
        }
        break
      case TYPE.tag:
        tags.add(element.value)
        collect(element.children, args, tags)
        break
    }
  }
}

function signature(message: string): MessageSignature {
  const args = new Set<string>()
  const tags = new Set<string>()
  collect(parse(message), args, tags)
  return { args: [...args].sort(), tags: [...tags].sort() }
}

/** Key paths present in `source` but absent from `target`. */
function missingPaths(source: Map<string, unknown>, target: Map<string, unknown>): string[] {
  return [...source.keys()].filter((path) => !target.has(path))
}

const esLeaves = flatten(esMessages)
const enLeaves = flatten(enMessages)
const esByPath = new Map(esLeaves.map((leaf) => [leaf.path, leaf.value]))
const enByPath = new Map(enLeaves.map((leaf) => [leaf.path, leaf.value]))

describe('English and Spanish dictionaries stay in step', () => {
  it('has the same key paths in both files', () => {
    expect({
      missingInEn: missingPaths(esByPath, enByPath),
      missingInEs: missingPaths(enByPath, esByPath),
    }).toEqual({ missingInEn: [], missingInEs: [] })
  })

  it('keeps the keys in the same order', () => {
    expect(enLeaves.map((leaf) => leaf.path)).toEqual(esLeaves.map((leaf) => leaf.path))
  })

  it('holds only strings in both files', () => {
    const notStrings = [...esLeaves, ...enLeaves]
      .filter((leaf) => typeof leaf.value !== 'string')
      .map((leaf) => leaf.path)

    expect(notStrings).toEqual([])
  })

  it('parses every message as valid ICU MessageFormat', () => {
    const failures: string[] = []
    for (const [locale, leaves] of [
      ['es', esLeaves],
      ['en', enLeaves],
    ] as const) {
      for (const { path, value } of leaves) {
        try {
          parse(value as string)
        } catch (error) {
          failures.push(`${locale}:${path}: ${(error as Error).message}`)
        }
      }
    }

    expect(failures).toEqual([])
  })

  it('uses the same ICU argument names and rich-text tags in every message', () => {
    const mismatches: string[] = []
    for (const [path, esValue] of esByPath) {
      const enValue = enByPath.get(path)
      if (typeof esValue !== 'string' || typeof enValue !== 'string') continue

      const es = signature(esValue)
      const en = signature(enValue)
      if (JSON.stringify(es.args) !== JSON.stringify(en.args)) {
        mismatches.push(`${path}: arguments es=[${es.args}] en=[${en.args}]`)
      }
      if (JSON.stringify(es.tags) !== JSON.stringify(en.tags)) {
        mismatches.push(`${path}: tags es=[${es.tags}] en=[${en.tags}]`)
      }
    }

    expect(mismatches).toEqual([])
  })

  it('has no empty English message unless the Spanish one is intentionally empty too', () => {
    const empty = enLeaves
      .filter(
        (leaf) =>
          typeof leaf.value === 'string' &&
          leaf.value.trim() === '' &&
          (esByPath.get(leaf.path) as string | undefined)?.trim() !== ''
      )
      .map((leaf) => leaf.path)

    expect(empty).toEqual([])
  })

  it('detects a missing key and a changed placeholder', () => {
    const [firstPath] = [...esByPath.keys()]
    const withoutKey = new Map(enByPath)
    withoutKey.delete(firstPath)
    expect(missingPaths(esByPath, withoutKey)).toEqual([firstPath])
    expect(missingPaths(withoutKey, esByPath)).toEqual([])

    expect(signature('{count, plural, one {# day} other {# days}}').args).toEqual(['count'])
    expect(signature('{total, plural, one {# day} other {# days}}').args).not.toEqual(
      signature('{count, plural, one {# day} other {# days}}').args
    )
    expect(signature('Delete <strong>{name}</strong>?')).toEqual({
      args: ['name'],
      tags: ['strong'],
    })
  })
})
