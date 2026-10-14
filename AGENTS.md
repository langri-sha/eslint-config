# Agents orientation — `langri-sha/eslint-config`

`@langri-sha/eslint-config` is the shared ESLint flat config the fleet lints
with: ESLint's recommended rules, typescript-eslint, React and React Hooks,
import-x ordering, JSDoc, Unicorn and Prettier. The package is the repository
root.

## Who owns which file

Projen writes `package.json` and every file listed in `.projen/files.json`; they
are read-only. Change them in `.projenrc.ts`, then run `pnpm exec projen`.
Beachball owns `CHANGELOG.md`, `CHANGELOG.json` and the `version` field.
Everything else — `src/`, `test/`, `readme.md`, `.github/workflows/`, this file
— is edited by hand. Repository settings, branch protection and the Actions
secrets are managed by `langri-sha/github-repos`.

## Common tasks

```sh
pnpm install
pnpm exec projen                        # re-synthesize from .projenrc.ts
pnpm test                               # vitest run over test/
pnpm tsc --build .                      # typecheck
pnpm eslint . && pnpm prettier --check .
pnpm change                             # write a change file
```

`test/` drives ESLint's `Linter` against `src/index.js`. It is not in the
tarball, and the Workspace workflow runs it through the shared `vitest` input.

## Linting with itself

`eslint.config.js` extends `./src/index.js`, the working tree, rather than the
last release on npm. A rule change lints this repository in the same pull
request that makes it, and the repository never installs an older copy of
itself. ESLint is a peer, so linting here runs on the devDependency the preset
installs. `eslint-plugin-react` still peers ESLint `^9.7` at most, so pnpm warns
about it under ESLint 10.

## Release

Beachball versions the package. Anything that reaches the tarball or builds it —
`src/`, `readme.md`, `package.json`, `tsconfig.build.json` — needs a change file
in the same pull request: run `pnpm change`. Use `none` for edits that shouldn't
cut a release on their own, such as readme-only changes. Root tooling is exempt;
`beachball.config.cjs` lists it, so lock file maintenance never cuts a release.
On Renovate pull requests that touch the package, CI writes a `patch` change
file itself.

Nothing publishes on merge. Run the Release workflow (`publish.yml`) from the
Actions tab to publish the pending change files through npm trusted publishing.
It tags the version `v<version>` and creates a GitHub release with generated
notes; a tag that already has a release is skipped, so the workflow is safe to
rerun. Beachball's own `gitTags` stays off, since it would name the tags
`@langri-sha/eslint-config_v<version>`.

`main` points at `src/index.js` in the repository, and `publishConfig` points
`main` and `types` at `dist/`, which `prepublishOnly` builds. The tarball ships
`src/` beside `dist/`. `src/eslint-config.d.ts` holds ambient module
declarations for some of the plugins `src/index.js` imports; `tsc` emits nothing
for it, so it ships in `src/` only.

There is deliberately no `engines` field. Published from the root, it would bind
consumers to the Node.js release this repository is developed on, so that lives
in `devEngines`, where `actions/setup-node` reads it.
