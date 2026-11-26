import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Input, Label, TextField } from '../components/hero'
import { storyLocale } from './story-locale'

const labels = {
  'en-US': {
    email: 'Email',
    placeholder: 'Enter your email',
  },
  'es-US': {
    email: 'Correo',
    placeholder: 'Ingresa tu correo',
  },
  'he-IL': {
    email: 'אימייל',
    placeholder: 'הזן את האימייל שלך',
  },
} as const

const meta = {
  component: TextField,
  render: (args, { globals }) => {
    const t = labels[storyLocale(globals)]
    return (
      <TextField className="w-full max-w-64" name="email" type="email" {...args}>
        <Label>{t.email}</Label>
        <Input placeholder={t.placeholder} />
      </TextField>
    )
  },
  tags: ['ai-generated', 'needs-work'],
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  play: async ({ canvas, globals }) => {
    const t = labels[storyLocale(globals)]
    await expect(canvas.getByLabelText(t.email)).toHaveAttribute('type', 'email')
  },
}

export const Disabled: Story = {
  args: { isDisabled: true },
}

export const WithValue: Story = {
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)]
    return (
      <TextField
        className="w-full max-w-64"
        defaultValue="pup@justpets.app"
        name="email"
        type="email"
      >
        <Label>{t.email}</Label>
        <Input placeholder={t.placeholder} />
      </TextField>
    )
  },
}
