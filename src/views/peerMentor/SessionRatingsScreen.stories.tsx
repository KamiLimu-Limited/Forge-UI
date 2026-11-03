import type { Meta, StoryObj } from '@storybook/react'
import { sampleGroupFeedback } from '../../../.storybook/peerMentorFixtures'
import { SessionRatingsScreen } from './SessionRatingsScreen'

const closed = { ...sampleGroupFeedback, submitted: 3, windowLine: null }

const meta: Meta<typeof SessionRatingsScreen> = {
  title: 'Screens/PeerMentor/SessionRatings',
  component: SessionRatingsScreen,
  parameters: { layout: 'padded' },
  args: { data: { session: closed, averageAcrossSessions: 4.3 } },
}

export default meta
type Story = StoryObj<typeof SessionRatingsScreen>

export const Default: Story = {}
export const NoRatings: Story = {
  args: {
    data: {
      session: { ...closed, submitted: 0, average: null, feedback: [] },
      averageAcrossSessions: 4.3,
    },
  },
}
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load this session's ratings. Try again.",
    onRetry: () => undefined,
  },
}
