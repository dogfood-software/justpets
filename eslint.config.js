import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { tanstackConfig } from '@tanstack/eslint-config'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const codeFiles = ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}']
const unusedVars = [
  'warn',
  {
    vars: 'all',
    args: 'after-used',
    ignoreRestSiblings: false,
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    destructuredArrayIgnorePattern: '^_',
    caughtErrorsIgnorePattern: '^(_|ignore)',
  },
]

export default defineConfig([
  globalIgnores([
    '**/node_modules/**',
    '**/.next/**',
    '**/.nx/**',
    '**/.tanstack/**',
    '**/.expo/**',
    '**/.turbo/**',
    '**/.vercel/**',
    '**/dist/**',
    '**/build/**',
    '**/out/**',
    '**/coverage/**',
    '**/playwright-report/**',
    '**/test-results/**',
    '.agents/**',
    '.codex/**',
    '**/routeTree.gen.ts',
    '**/next-env.d.ts',
    '**/*.d.json.ts',
    '**/payload-types.ts',
    '**/payload-generated-schema.ts',
    '**/importMap.js',
    '**/src/migrations/**',
    '**/public/**',
  ]),
  {
    name: 'justpets/shared',
    files: codeFiles,
    ignores: ['web/app/**', 'web/site/**'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': unusedVars,
    },
  },
  {
    name: 'justpets/browser',
    files: ['web/**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    name: 'justpets/ui',
    files: ['web/ui/**/*.{js,jsx,ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
  },
  {
    name: 'justpets/app',
    basePath: 'web/app',
    extends: tanstackConfig,
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
    },
  },
  {
    name: 'justpets/site',
    basePath: 'web/site',
    extends: [...nextCoreWebVitals, ...nextTypescript],
    settings: {
      next: { rootDir: fileURLToPath(new URL('./web/site/', import.meta.url)) },
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': unusedVars,
    },
  },
  // Keep formatting in Prettier, including when framework presets enable stylistic rules.
  prettier,
])
