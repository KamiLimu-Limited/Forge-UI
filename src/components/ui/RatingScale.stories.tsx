import type { Meta, StoryObj } from '@storybook/react'
import { RatingScale } from './RatingScale'

const meta: Meta<typeof RatingScale> = {
  title: 'UI/RatingScale',
  component: RatingScale,
  tags: ['autodocs'],
  args: {
    question: 'How useful was this session to you?',
    value: undefined,
    onChange: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof RatingScale>

export const Default: Story = {}
export const Selected: Story = { args: { value: 4 } }
export const WithError: Story = { args: { error: 'Choose a rating' } }
export const Disabled: Story = { args: { value: 3, disabled: true } }
// The question stays for screen readers only
export const Compact: Story = { args: { compact: true, value: 2 } }
