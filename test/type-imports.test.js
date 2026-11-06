import { describe, expect, test } from '@langri-sha/vitest'
import { Linter } from 'eslint'

import config from '../src/index.js'

const linter = new Linter()

const typeImportRules = new Set([
  '@typescript-eslint/consistent-type-imports',
  '@typescript-eslint/no-import-type-side-effects',
])

const messages = (code, filename = 'case.ts') =>
  linter
    .verify(code, config, { filename })
    .filter(({ ruleId }) => typeImportRules.has(ruleId))

const fixed = (code, filename = 'case.ts') =>
  linter.verifyAndFix(code, config, { filename }).output

describe('type-only imports', () => {
  describe('reports', () => {
    const cases = {
      'inline type specifier': [
        "import { type X } from 'm'\nexport const x: X = 1\n",
        '@typescript-eslint/no-import-type-side-effects',
      ],
      'value import used only as a type': [
        "import { X } from 'm'\nexport const x: X = 1\n",
        '@typescript-eslint/consistent-type-imports',
      ],
      'default import used only as a type': [
        "import X from 'm'\nexport const x: X = 1\n",
        '@typescript-eslint/consistent-type-imports',
      ],
    }

    for (const [name, [code, ruleId]] of Object.entries(cases)) {
      test(name, () => {
        expect(messages(code).map((message) => message.ruleId)).toEqual([
          ruleId,
        ])
      })
    }
  })

  describe('fixes to a type-only import declaration', () => {
    const cases = {
      'inline type specifier':
        "import { type X } from 'm'\nexport const x: X = 1\n",
      'value import used only as a type':
        "import { X } from 'm'\nexport const x: X = 1\n",
      'several inline type specifiers':
        "import { type X, type Y } from 'm'\nexport const x: [X, Y] = [1, 2]\n",
    }

    for (const [name, code] of Object.entries(cases)) {
      test(name, () => {
        expect(fixed(code)).toMatch(/^import type \{ X(, Y)? \} from 'm'$/m)
        expect(fixed(code)).not.toMatch(/import \{/)
      })
    }
  })

  describe('leaves no errors after fixing', () => {
    const cases = {
      'value and type specifiers':
        "import { X, y } from 'm'\nexport const x: X = y\n",
      'default and type specifier':
        "import D, { X } from 'm'\nexport const x: X = D\n",
      'default and value specifier':
        "import D, { y } from 'm'\nexport const x: D = y\n",
    }

    for (const [name, code] of Object.entries(cases)) {
      test(name, () => {
        expect(
          linter.verifyAndFix(code, config, { filename: 'case.ts' }).messages,
        ).toEqual([])
      })
    }
  })

  describe('accepts', () => {
    const cases = {
      'type-only declaration':
        "import type { X } from 'm'\nexport const x: X = 1\n",
      'value import used as a value':
        "import { y } from 'm'\nexport const x = y\n",
      'inline type beside a value specifier':
        "import { type X, y } from 'm'\nexport const x: X = y\n",
      'import type annotation': "export const x: import('m').X = 1\n",
      'side-effect import': "import 'm'\n",
    }

    for (const [name, code] of Object.entries(cases)) {
      test(name, () => {
        expect(messages(code)).toEqual([])
      })
    }
  })

  describe('applies to every TypeScript extension', () => {
    for (const extension of ['ts', 'mts', 'cts', 'tsx']) {
      test(extension, () => {
        expect(
          messages(
            "import { type X } from 'm'\nexport const x: X = 1\n",
            `case.${extension}`,
          ),
        ).toHaveLength(1)
      })
    }
  })
})
