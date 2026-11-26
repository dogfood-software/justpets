<div align="center">

<a href="https://justpets.app" target="_blank">
    <img src="./assets/wordmark.svg" height="60px" style="margin-bottom: 1rem">
</a>

[![License: FSL-1.1-ALv2](https://img.shields.io/badge/License-FSL–1.1–ALv2-blue.svg)](https://fsl.software/)

</div>

---

> [!WARNING]
>
> This is a WIP and pre-release software. This ReadMe will be filled out as the project is built

JustPets is a software platform for managing pets. From Breeding or Adoption, to Training, Healthcare and death. The entire product is, as much as possible, contained within this monorepo.

## Linting and formatting

All apps and libraries use ESLint and Prettier, configured in `eslint.config.js` and
`prettier.config.js` at the repository root. ESLint retains the TanStack rules for `web/app`,
the Next.js rules for `web/site`, and React Hooks rules for `web/ui`. Other packages use
the recommended JavaScript and TypeScript rules. Prettier handles formatting; ESLint's
formatting rules are disabled with `eslint-config-prettier`.

Run these commands from the repository root:

```sh
pnpm lint          # Check code across the repository
pnpm lint:fix      # Apply automatic lint fixes
pnpm format        # Format the repository
pnpm format:check  # Check formatting without writing files
pnpm check         # Run lint, formatting, and package checks
```

Each package also provides `lint`, `lint:fix`, `format`, and `format:check` scripts.
Generated files, build output, and package manager lockfiles are excluded.

In VS Code, install the recommended ESLint and Prettier extensions. Saving a file runs
Prettier and applies available ESLint fixes. The pre-commit hook formats files before
running checks, and CI checks both lint and formatting.

---

© [Dogfood Software LLC](https://dogfood.software) 2026 | [LICENSE.md](./LICENSE.md)
