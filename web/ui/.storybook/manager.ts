import { addons } from 'storybook/manager-api'

import '@fontsource-variable/sn-pro/wght-italic.css'
import '@fontsource-variable/fredoka/wdth.css'

import { preferredJustPetsTheme } from './theme'

function applyTheme() {
  addons.setConfig({
    theme: preferredJustPetsTheme(),
  })
}

applyTheme()

if (typeof window !== 'undefined' && window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme)
}
