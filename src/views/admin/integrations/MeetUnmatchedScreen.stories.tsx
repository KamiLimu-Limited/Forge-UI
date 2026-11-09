import type { Meta, StoryObj } from '@storybook/react'
import { MeetUnmatchedScreen } from './MeetUnmatchedScreen'

const meta: Meta<typeof MeetUnmatchedScreen> = {
  title: 'Screens/Admin/MeetUnmatched',
  component: MeetUnmatchedScreen,
  parameters: { layout: 'padded' },
  args: {
    sessionId: 's-1',
    session: {
      id: 's-1',
      title: 'User Validation and the Competitions Ahead',
      startsAt: '2026-08-22T10:00:00+03:00',
    },
  },
}

export default meta
type Story = StoryObj<typeof MeetUnmatchedScreen>

export const NotAvailableYet: Story = {}
export const Loading: Story = { args: { session: null, isLoading: true } }
export const WithError: Story = {
  args: {
    session: null,
    error: "We couldn't load this session. Try again.",
    onRetry: () => undefined,
  },
}
