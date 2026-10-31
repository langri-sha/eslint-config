import { describe, expect, test } from '@langri-sha/vitest'
import { Linter } from 'eslint'

import config from '../src/index.js'

const linter = new Linter()

const ruleIds = (code, filename = 'case.jsx') =>
  linter.verify(code, config, { filename }).map(({ ruleId }) => ruleId)

describe('react', () => {
  test('detects a class that extends React.Component through JSDoc', () => {
    const code = [
      "import React from 'react'",
      '',
      '/** @extends React.Component */',
      'export class A extends B {',
      '  render() {',
      '    return <p>{this.props.name}</p>',
      '  }',
      '}',
      '',
    ].join('\n')

    expect(ruleIds(code)).toContain('react/prop-types')
  })

  test('lints without throwing with the React version detected', () => {
    const detecting = [
      ...config,
      { settings: { react: { version: 'detect' } } },
    ]

    expect(() =>
      linter.verify('export const A = () => <p />\n', detecting, {
        filename: 'case.jsx',
      }),
    ).not.toThrow()
  })
})
