import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: { label: 'Notes', placeholder: 'What did you work on this week?' },
}

export const WithHint: Story = {
  args: { label: 'Notes', hint: 'Only you and your mentor can see these notes.' },
}

export const WithError: Story = {
  args: { label: 'Notes', error: 'Add a few words before saving.' },
}

export const Disabled: Story = {
  args: { label: 'Notes', defaultValue: 'Submitted on 12 March.', disabled: true },
}
