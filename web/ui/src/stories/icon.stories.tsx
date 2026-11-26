import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Icon } from '../components/icon'
import { faBone, faDog, faHeart } from '../icons/solid'
import { storyLocale } from './story-locale'

const labels = {
  'en-US': { bone: 'Bone', dog: 'Dog', heart: 'Heart' },
  'es-US': { bone: 'Hueso', dog: 'Perro', heart: 'Corazón' },
  'he-IL': { bone: 'עצם', dog: 'כלב', heart: 'לב' },
} as const

const meta = {
  args: {
    icon: faDog,
  },
  component: Icon,
  tags: ['ai-generated', 'needs-work'],
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Dog: Story = {
  play: async ({ canvas, globals }) => {
    const t = labels[storyLocale(globals)]
    await expect(canvas.getByLabelText(t.dog)).toBeVisible()
  },
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)]
    return <Icon aria-label={t.dog} icon={faDog} />
  },
}

export const Heart: Story = {
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)]
    return <Icon aria-label={t.heart} icon={faHeart} />
  },
}

export const Bone: Story = {
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)]
    return <Icon aria-label={t.bone} icon={faBone} />
  },
}
