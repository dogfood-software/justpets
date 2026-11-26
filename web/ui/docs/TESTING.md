# Testing `@web/ui`

Prefer the **real dependency surface** over mocks. Mocks hide integration bugs (wrong event shape, missing API, class-merge order). Pick the lightest runner that still exercises that surface.

## Three surfaces

| Kind                       | Example         | Real surface                             | File naming                      | Vitest project |
| -------------------------- | --------------- | ---------------------------------------- | -------------------------------- | -------------- |
| Components / visual / a11y | Button stories  | Real DOM, CSS, HeroUI, a11y addon        | `src/stories/*.stories.tsx`      | `storybook`    |
| Hooks / browser APIs       | `useCookie`     | Real `cookieStore`, change events, React | `src/**/*.browser.test.{ts,tsx}` | `browser`      |
| Pure utilities             | `cn` / `cnAria` | Real `clsx` + `tailwind-merge`           | `src/**/*.test.ts`               | `node`         |

Node for pure utils is not a mock: those functions are string transforms with no DOM. Still do **not** mock `clsx` / `twMerge`.

## Why storybook and browser stay separate

`@storybook/addon-vitest` owns `test.include` for the Storybook project (custom includes are ignored). Storybook docs recommend separate Vitest projects for unit vs Storybook tests. Two Chromium boots when both run is fine; Storybook usually dominates wall time.

## Running tests

From `packages/ui`:

```bash
pnpm test                         # all projects
pnpm exec vitest --project storybook run
pnpm exec vitest --project browser run
pnpm exec vitest --project node run
```

## Storybook stories

- Shared preview: theme, locale toolbar, real CSS (`.storybook/preview.tsx`)
- Interaction checks: `play` + `expect` from `storybook/test`
- Accessibility: `@storybook/addon-a11y`

### Locale label maps

Story copy follows the Storybook locale toolbar so you can see LTR/RTL and string length in context. Use a simple keyed object — **not** the app translation manager:

```tsx
import { storyLocale } from '@web/ui/stories/story-locale'
import { DEFAULT_LOCALE, type Locale } from '@libraries/i18n'

const labels = {
  'en-US': { primary: 'Order now' },
  'es-US': { primary: 'Ordenar ahora' },
  'he-IL': { primary: 'הזמן עכשיו' },
} as const

render: (_args, { globals }) => {
  const t = labels[storyLocale(globals)]
  return <Button>{t.primary}</Button>
}
```

`play` functions should assert against the same locale’s labels.

## Examples

- Stories: [`src/stories/button.stories.tsx`](../src/stories/button.stories.tsx)
- Browser hook: [`src/hooks/use-cookie.browser.test.tsx`](../src/hooks/use-cookie.browser.test.tsx)
- Node util: [`src/utils/cn.test.ts`](../src/utils/cn.test.ts)
