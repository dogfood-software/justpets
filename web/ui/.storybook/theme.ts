import { create, type ThemeVars } from 'storybook/theming'

/**
 * Storybook manager/docs chrome theme aligned with @web/ui tokens.
 * Accent matches brand green in logo.svg / --accent (oklch 53% 0.1219 151.51).
 * @see https://storybook.js.org/docs/configure/user-interface/theming
 */
const brand = {
  appBorderRadius: 16,
  brandImage: '/logo.svg',
  brandTarget: '_blank',
  brandTitle: 'JustPets',
  brandUrl: 'https://justpets.app',
  colorPrimary: '#267f46',
  colorSecondary: '#267f46',
  fontBase: '"Sn Pro Variable", "Fredoka Variable", sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  inputBorderRadius: 16,
} as const satisfies Partial<ThemeVars>

export const justpetsThemeLight = create({
  base: 'light',
  ...brand,

  // oklch(97.02% 0.0020 151.51) / light surfaces from globals.css
  appBg: '#F4F5F4',
  appBorderColor: '#E3E4E3',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#F7F8F7',
  barBg: '#FFFFFF',
  barHoverColor: '#267f46',
  barSelectedColor: '#267f46',

  barTextColor: '#848886',

  inputBg: '#FFFFFF',
  inputBorder: '#E3E4E3',
  inputTextColor: '#1A1C1A',

  textColor: '#1A1C1A',
  textInverseColor: '#FFFFFF',
  textMutedColor: '#848886',
})

export const justpetsThemeDark = create({
  base: 'dark',
  ...brand,

  // dark surfaces from globals.css (--background / --surface*)
  appBg: '#141514',
  appBorderColor: '#383B38',
  appContentBg: '#1C1F1C',
  appPreviewBg: '#141514',
  barBg: '#1C1F1C',
  barHoverColor: '#267f46',
  barSelectedColor: '#267f46',

  barTextColor: '#A8ABA8',

  inputBg: '#1C1F1C',
  inputBorder: '#383B38',
  inputTextColor: '#F4F5F4',

  textColor: '#F4F5F4',
  textInverseColor: '#1A1C1A',
  textMutedColor: '#A8ABA8',
})

/** @deprecated Prefer justpetsThemeLight / justpetsThemeDark */
export const justpetsTheme = justpetsThemeLight

export function preferredJustPetsTheme() {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return justpetsThemeDark
  }
  return justpetsThemeLight
}
