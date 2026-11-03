import type { Meta, StoryObj } from '@storybook/react'
import { sampleBoard } from '../../../.storybook/menteeFixtures'
import { PeerLeaderboardScreen } from './PeerLeaderboardScreen'

const meta: Meta<typeof PeerLeaderboardScreen> = {
  title: 'Screens/PeerMentor/Leaderboards',
  component: PeerLeaderboardScreen,
  parameters: { layout: 'padded' },
  args: {
    tab: 'mentees',
    onTabChange: () => undefined,
    dimension: 'core_attendance',
    onDimensionChange: () => undefined,
    // A peer mentor isn't on the mentee board
    entries: sampleBoard.map((entry) => ({ ...entry, is_me: false })),
  },
}

export default meta
type Story = StoryObj<typeof PeerLeaderboardScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Mentees: Story = {}
export const PeerMentors: Story = { args: { tab: 'peer-mentors' } }
export const Loading: Story = { args: { entries: null, isLoading: true } }
export const WithError: Story = {
  args: {
    entries: null,
    error: "We couldn't load the leaderboard. Try again.",
    onRetry: () => undefined,
  },
}
