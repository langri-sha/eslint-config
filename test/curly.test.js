import { describe, expect, test } from '@langri-sha/vitest'
import { Linter } from 'eslint'

import config from '../src/index.js'

const linter = new Linter()

const curlyMessages = (code, filename = 'case.ts') =>
  linter
    .verify(code, config, { filename })
    .filter(({ ruleId }) => ruleId === 'curly')

describe('curly', () => {
  describe('reports unbraced bodies', () => {
    const cases = {
      'if on the same line': 'if (a) f()',
      'if on the next line': 'if (a)\n  f()',
      'if with a return': 'function g() { if (a) return 1 }',
      else: 'if (a) {\n  f()\n} else f()',
      'else on the next line': 'if (a) {\n  f()\n} else\n  f()',
      for: 'for (let i = 0; i < 2; i++) f()',
      'for-in': 'for (const k in o) f()',
      'for-of': 'for (const x of xs) f()',
      while: 'while (a) f()',
      'do-while': 'do f()\nwhile (a)',
      'else if body': 'if (a) {\n  f()\n} else if (b) f()',
    }

    for (const [name, code] of Object.entries(cases)) {
      test(name, () => {
        expect(curlyMessages(code)).toHaveLength(1)
      })
    }
  })

  describe('accepts braced bodies', () => {
    const cases = {
      if: 'if (a) {\n  f()\n}',
      'if else': 'if (a) {\n  f()\n} else {\n  f()\n}',
      'else if': 'if (a) {\n  f()\n} else if (b) {\n  f()\n} else {\n  f()\n}',
      for: 'for (let i = 0; i < 2; i++) {\n  f()\n}',
      'for-in': 'for (const k in o) {\n  f()\n}',
      'for-of': 'for (const x of xs) {\n  f()\n}',
      while: 'while (a) {\n  f()\n}',
      'do-while': 'do {\n  f()\n} while (a)',
    }

    for (const [name, code] of Object.entries(cases)) {
      test(name, () => {
        expect(curlyMessages(code)).toEqual([])
      })
    }
  })

  describe('applies to every linted extension', () => {
    for (const extension of ['js', 'cjs', 'mjs', 'jsx', 'ts', 'mts', 'tsx']) {
      test(extension, () => {
        expect(curlyMessages('if (a) f()', `case.${extension}`)).toHaveLength(1)
      })
    }
  })
})
