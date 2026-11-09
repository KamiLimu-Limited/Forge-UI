import type { Meta, StoryObj } from '@storybook/react'
import { sampleMentoredSession } from '../../../.storybook/peerMentorFixtures'
import { SessionRatingsScreen } from './SessionRatingsScreen'

const meta: Meta<typeof SessionRatingsScreen> = {
  title: 'Screens/PeerMentor/SessionRatings',
  component: SessionRatingsScreen,
  parameters: { layout: 'padded' },
  args: { data: { session: sampleMentoredSession, averageAcrossSessions: 4.3 } },
}

export default meta
type Story = StoryObj<typeof SessionRatingsScreen>

export const Default: Story = {}
export const NoRatings: Story = {
  args: {
    data: {
      session: { ...sampleMentoredSession, responses: 0, average: null, feedback: [] },
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
