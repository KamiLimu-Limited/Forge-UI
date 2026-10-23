import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from './EmptyState'
import { Button } from './Button'

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = { args: { title: 'No users found' } }

export const WithDescription: Story = {
  args: {
    title: 'No users found',
    description: 'Try a different filter, or invite someone new.',
    icon: 'users',
  },
}

export const WithAction: Story = {
  args: {
    title: 'No users found',
    description: 'Invite the first member of your cohort.',
    icon: 'users',
    action: <Button>Invite user</Button>,
  },
}
