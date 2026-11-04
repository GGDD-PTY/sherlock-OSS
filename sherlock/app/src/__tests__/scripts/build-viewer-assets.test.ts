import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

import { buildPdfjsAssets } from '../../../scripts/build-viewer-assets.mjs'

const directories: string[] = []

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'sherlock-viewer-assets-'))
  directories.push(root)
  const pdfjsDir = join(root, 'source')
  const pdfjsOut = join(root, 'output')
  const files = new Map([
    ['build/pdf.worker.min.mjs', 'worker-good'],
    ['cmaps/sample.bcmap', 'cmap-good'],
    ['standard_fonts/sample.pfb', 'font-good'],
    ['wasm/sample.wasm', 'wasm-good'],
    ['iccs/sample.icc', 'icc-good'],
  ])
  for (const [path, contents] of files) {
    const target = join(pdfjsDir, path)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, contents)
  }
  return { pdfjsDir, pdfjsOut, files }
}

afterEach(() => {
  for (const directory of directories.splice(0)) {
    rmSync(directory, { recursive: true, force: true })
  }
})

describe('buildPdfjsAssets', () => {
  it('repairs same-size tampering even when the output is newer', () => {
    const { pdfjsDir, pdfjsOut } = fixture()
    buildPdfjsAssets({ pdfjsDir, pdfjsOut })

    const worker = join(pdfjsOut, 'pdf.worker.min.mjs')
    writeFileSync(worker, 'worker-evil')
    const future = new Date(Date.now() + 60_000)
    utimesSync(worker, future, future)

    buildPdfjsAssets({ pdfjsDir, pdfjsOut })

    expect(readFileSync(worker, 'utf8')).toBe('worker-good')
  })

  it('repairs missing and unexpected nested assets', () => {
    const { pdfjsDir, pdfjsOut } = fixture()
    buildPdfjsAssets({ pdfjsDir, pdfjsOut })

    rmSync(join(pdfjsOut, 'cmaps/sample.bcmap'))
    writeFileSync(join(pdfjsOut, 'cmaps/unexpected.bcmap'), 'unexpected')

    buildPdfjsAssets({ pdfjsDir, pdfjsOut })

    expect(readFileSync(join(pdfjsOut, 'cmaps/sample.bcmap'), 'utf8')).toBe('cmap-good')
    expect(() => statSync(join(pdfjsOut, 'cmaps/unexpected.bcmap'))).toThrow()
  })

  it('leaves an identical tree untouched', () => {
    const { pdfjsDir, pdfjsOut } = fixture()
    buildPdfjsAssets({ pdfjsDir, pdfjsOut })
    const worker = join(pdfjsOut, 'pdf.worker.min.mjs')
    const before = statSync(worker).mtimeMs

    buildPdfjsAssets({ pdfjsDir, pdfjsOut })

    expect(statSync(worker).mtimeMs).toBe(before)
  })
})
