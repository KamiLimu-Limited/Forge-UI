import type { Meta, StoryObj } from '@storybook/react'
import { sampleTrackSessions } from '../../../.storybook/ictPeerMentorFixtures'
import { TrackSessionsScreen } from './TrackSessionsScreen'

const meta: Meta<typeof TrackSessionsScreen> = {
  title: 'Screens/IctPeerMentor/TrackSessions',
  component: TrackSessionsScreen,
  parameters: {
    layout: 'padded',
    nextjs: { navigation: { pathname: '/dashboard/track/sessions' } },
  },
  args: { data: sampleTrackSessions },
}

export default meta
type Story = StoryObj<typeof TrackSessionsScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Default: Story = {}
export const NoSessionsYet: Story = {
  args: { data: { ...sampleTrackSessions, sessions: [], next: null } },
}
export const NoTrackYet: Story = { args: { data: null } }
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load your track's sessions. Try again.",
    onRetry: () => undefined,
  },
}
