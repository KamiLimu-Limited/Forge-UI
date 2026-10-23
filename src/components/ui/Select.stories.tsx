import type { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'

const options = [
  { value: 'mentee', label: 'Mentee' },
  { value: 'peer_mentor_1:1', label: '1:1 Peer Mentor' },
  { value: 'committee', label: 'Committee' },
]

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  args: { label: 'Role', options, placeholder: 'Pick a role', defaultValue: '' },
}

export const WithHint: Story = {
  args: { label: 'Role', options, defaultValue: 'mentee', hint: 'You can add more roles later.' },
}

export const WithError: Story = {
  args: {
    label: 'Role',
    options,
    placeholder: 'Pick a role',
    defaultValue: '',
    error: 'Pick a role.',
  },
}

export const Empty: Story = { args: { label: 'Cohort', options: [] } }

export const Disabled: Story = {
  args: { label: 'Role', options, defaultValue: 'mentee', disabled: true },
}
