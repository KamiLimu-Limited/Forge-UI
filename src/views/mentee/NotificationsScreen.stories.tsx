import type { Meta, StoryObj } from '@storybook/react'
import { sampleNotifications } from '../../../.storybook/menteeFixtures'
import { NotificationsScreen } from './NotificationsScreen'

const meta: Meta<typeof NotificationsScreen> = {
  title: 'Screens/Mentee/Notifications',
  component: NotificationsScreen,
  parameters: { layout: 'padded' },
  args: {
    notifications: sampleNotifications,
    unreadCount: 2,
    onOpen: () => undefined,
    onMarkAllRead: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof NotificationsScreen>

export const Default: Story = {}
export const AllRead: Story = {
  args: {
    notifications: sampleNotifications.map((item) => ({ ...item, read_at: item.created_at })),
    unreadCount: 0,
  },
}
export const Empty: Story = { args: { notifications: [], unreadCount: 0 } }
export const Loading: Story = { args: { notifications: null, isLoading: true } }
export const WithError: Story = {
  args: {
    notifications: null,
    error: "We couldn't load your notifications. Try again.",
    onRetry: () => undefined,
  },
}
