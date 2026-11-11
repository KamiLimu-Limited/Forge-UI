import type { Meta, StoryObj } from '@storybook/react'
import { menteeUser } from '../../../.storybook/fixtures'
import { sampleHistory } from '../../../.storybook/menteeFixtures'
import { HistoryScreen } from './HistoryScreen'

const meta: Meta<typeof HistoryScreen> = {
  title: 'Screens/Mentee/History',
  component: HistoryScreen,
  parameters: {
    layout: 'padded',
    auth: { user: menteeUser },
    nextjs: { appDirectory: true, navigation: { pathname: '/dashboard/sessions/history' } },
  },
  args: { data: { monthLine: 'Month 5 of 8', rows: sampleHistory } },
}

export default meta
type Story = StoryObj<typeof HistoryScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Default: Story = {}
export const NoSessionsYet: Story = { args: { data: { monthLine: null, rows: [] } } }
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load your session history. Try again.",
    onRetry: () => undefined,
  },
}
// A 1:1 peer mentor using the same screen: everything shows, saving is switched off
