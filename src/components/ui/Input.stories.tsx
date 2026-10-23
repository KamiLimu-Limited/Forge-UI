import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { label: 'Email', placeholder: 'you@example.com', type: 'email' },
}

export const WithHint: Story = {
  args: { label: 'First name', hint: 'As it appears on your student ID.' },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    type: 'email',
    defaultValue: 'amina@',
    error: 'Enter a valid email address.',
  },
}

export const Disabled: Story = {
  args: { label: 'Email', value: 'amina.otieno@example.com', disabled: true, readOnly: true },
}
