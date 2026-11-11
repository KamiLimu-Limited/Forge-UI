import type { Meta, StoryObj } from '@storybook/react'
import { sampleFacilitator } from '../../../.storybook/peerMentorFixtures'
import { FacilitatorScreen } from './FacilitatorScreen'

const meta: Meta<typeof FacilitatorScreen> = {
  title: 'Screens/PeerMentor/Facilitator',
  component: FacilitatorScreen,
  parameters: { layout: 'padded' },
  args: { data: sampleFacilitator },
}

export default meta
type Story = StoryObj<typeof FacilitatorScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Default: Story = {}
export const FirstSessionOpen: Story = {
  args: {
    data: {
      completed: 0,
      inProgress: 1,
      average: null,
      peerAverage: 4.1,
      best: null,
      sessions: sampleFacilitator.sessions.slice(0, 1),
      trend: [],
    },
  },
}
export const NoSessionsYet: Story = {
  args: {
    data: {
      completed: 0,
      inProgress: 0,
      average: null,
      peerAverage: null,
      best: null,
      sessions: [],
      trend: [],
    },
  },
}
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load your sessions. Try again.",
    onRetry: () => undefined,
  },
}
