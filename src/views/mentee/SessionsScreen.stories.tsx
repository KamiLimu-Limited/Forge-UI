import type { Meta, StoryObj } from '@storybook/react'
import { menteeUser } from '../../../.storybook/fixtures'
import { sampleSessions } from '../../../.storybook/menteeFixtures'
import { SessionsScreen } from './SessionsScreen'

const meta: Meta<typeof SessionsScreen> = {
  title: 'Screens/Mentee/Sessions',
  component: SessionsScreen,
  parameters: {
    layout: 'padded',
    auth: { user: menteeUser },
    nextjs: { appDirectory: true, navigation: { pathname: '/dashboard/sessions' } },
  },
  args: { data: sampleSessions },
}

export default meta
type Story = StoryObj<typeof SessionsScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Default: Story = {}
export const NothingOpen: Story = { args: { data: { ...sampleSessions, open: [] } } }
export const Empty: Story = { args: { data: { monthLine: null, open: [], upcoming: [] } } }
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load your sessions. Try again.",
    onRetry: () => undefined,
  },
}
