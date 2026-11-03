import type { Meta, StoryObj } from '@storybook/react'
import { NotificationBellView } from './NotificationBell'

const meta: Meta<typeof NotificationBellView> = {
  title: 'Forge/NotificationBell',
  component: NotificationBellView,
  tags: ['autodocs'],
  args: { unread: 3 },
}

export default meta
type Story = StoryObj<typeof NotificationBellView>

export const Unread: Story = {}
export const AllRead: Story = { args: { unread: 0 } }
