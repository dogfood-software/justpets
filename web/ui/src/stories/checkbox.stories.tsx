import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Checkbox } from '../components/hero'
import { storyLocale } from './story-locale'

const labels = {
  'en-US': { terms: 'Accept terms and conditions' },
  'es-US': { terms: 'Aceptar términos y condiciones' },
  'he-IL': { terms: 'קבל את התנאים וההגבלות' },
} as const

const meta = {
  component: Checkbox,
  render: (args, { globals }) => {
    const t = labels[storyLocale(globals)]
    return (
      <Checkbox {...args}>
        <Checkbox.Content>
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          {t.terms}
        </Checkbox.Content>
      </Checkbox>
    )
  },
  tags: ['ai-generated', 'needs-work'],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Unchecked: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox')).not.toBeChecked()
  },
}

export const Checked: Story = {
  args: { defaultSelected: true },
}

export const Disabled: Story = {
  args: { isDisabled: true },
}
