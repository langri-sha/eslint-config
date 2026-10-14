# @langri-sha/eslint-config

A shared [ESLint] flat config for JavaScript, TypeScript and React projects. It
enables the recommended rules from ESLint, [typescript-eslint], React and React
Hooks, enforces an import order, and reports [Prettier] formatting differences
as errors.

## Usage

Install the required dependencies:

```sh
npm install -D eslint @langri-sha/eslint-config
```

Then add your configuration to `eslint.config.js`:

```js
import config from '@langri-sha/eslint-config'

export default [...config, { ignores: ['**/dist/'] }]
```

## Contributing

See [CONTRIBUTING.md] in `langri-sha/github`.

[contributing.md]:
  https://github.com/langri-sha/github/blob/main/CONTRIBUTING.md
[eslint]: https://eslint.org/docs/latest/use/getting-started
[prettier]: https://prettier.io/docs/
[typescript-eslint]: https://typescript-eslint.io/
