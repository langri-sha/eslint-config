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

[eslint]: https://eslint.org/docs/latest/use/getting-started
[prettier]: https://prettier.io/docs/
[typescript-eslint]: https://typescript-eslint.io/
