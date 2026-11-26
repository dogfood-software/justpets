import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Button } from '../components/hero'
import { storyLocale } from './story-locale'

const labels = {
  'en-US': {
    ghost: 'Skip',
    outline: 'Learn more',
    primary: 'Order now',
    secondary: 'Cancel',
    submit: 'Submit',
  },
  'es-US': {
    ghost: 'Omitir',
    outline: 'Más información',
    primary: 'Ordenar ahora',
    secondary: 'Cancelar',
    submit: 'Enviar',
  },
  'he-IL': {
    ghost: 'דלג',
    outline: 'למידע נוסף',
    primary: 'הזמן עכשיו',
    secondary: 'ביטול',
    submit: 'שלח',
  },
} as const

const sansFontFamily = /Sn Pro Variable/

const meta = {
  component: Button,
  tags: ['ai-generated', 'needs-work'],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  play: async ({ canvas, globals }) => {
    const t = labels[storyLocale(globals)]
    await expect(canvas.getByRole('button', { name: t.primary })).toHaveAttribute(
      'data-slot',
      'button',
    )
  },
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)]
    return <Button variant="primary">{t.primary}</Button>
  },
}

export const Secondary: Story = {
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)]
    return <Button variant="secondary">{t.secondary}</Button>
  },
}

export const Outline: Story = {
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)]
    return <Button variant="outline">{t.outline}</Button>
  },
}

export const Ghost: Story = {
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)]
    return <Button variant="ghost">{t.ghost}</Button>
  },
}

/** Proves globals.css (Tailwind + theme fonts) loaded in the shared preview. */
export const CssCheck: Story = {
  play: async ({ canvas, globals }) => {
    const t = labels[storyLocale(globals)]
    const button = canvas.getByRole('button', { name: t.submit })
    // globals.css sets --font-sans to "Sn Pro Variable", "Fredoka Variable", sans-serif
    await expect(getComputedStyle(button).fontFamily).toMatch(sansFontFamily)
  },
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)]
    return <Button variant="primary">{t.submit}</Button>
  },
}
