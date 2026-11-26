import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Avatar } from '../components/hero'
import { storyLocale } from './story-locale'

const labels = {
  'en-US': {
    fallback: 'JD',
    imageAlt: 'Green avatar',
    imageFallback: 'GR',
    initials: 'AB',
  },
  'es-US': {
    fallback: 'JD',
    imageAlt: 'Avatar verde',
    imageFallback: 'GR',
    initials: 'AB',
  },
  'he-IL': {
    fallback: 'י.ד.',
    imageAlt: 'אווטאר ירוק',
    imageFallback: 'י.ר.',
    initials: 'א.ב.',
  },
} as const

const meta = {
  component: Avatar,
  tags: ['ai-generated', 'needs-work'],
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Fallback: Story = {
  play: async ({ canvas, globals }) => {
    const t = labels[storyLocale(globals)]
    await expect(canvas.getByText(t.fallback)).toBeVisible()
  },
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)]
    return (
      <Avatar>
        <Avatar.Fallback>{t.fallback}</Avatar.Fallback>
      </Avatar>
    )
  },
}

export const Initials: Story = {
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)]
    return (
      <Avatar>
        <Avatar.Fallback>{t.initials}</Avatar.Fallback>
      </Avatar>
    )
  },
}

export const WithImage: Story = {
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)]
    return (
      <Avatar>
        <Avatar.Image
          alt={t.imageAlt}
          src="https://api.dicebear.com/10.x/landscape/svg?animationProbability=100"
        />
        <Avatar.Fallback>{t.imageFallback}</Avatar.Fallback>
      </Avatar>
    )
  },
}
