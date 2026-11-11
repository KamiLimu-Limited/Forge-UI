import type { Meta, StoryObj } from '@storybook/react'
import type { PeerMentorRow } from '@/types/leaderboard'
import { sampleBoard } from '../../../.storybook/menteeFixtures'
import { PeerLeaderboardScreen } from './PeerLeaderboardScreen'

// Sample peer mentors for stories. Not real people.
const peerEntries: PeerMentorRow[] = [
  { name: 'Wanjiru Mwangi', attended: 14, extra: 3, core: 100, overall: 104 },
  { name: 'Hansel Omondi', attended: 13, extra: 5, core: 93, overall: 101 },
  { name: 'Achieng Odhiambo', attended: 12, extra: 1, core: 86, overall: 88 },
].map((row, index) => ({
  rank: index + 1,
  peer_mentor_id: `pm-${index}`,
  display_name: row.name,
  is_me: index === 1,
  sessions_attended: row.attended,
  extra_sessions: row.extra,
  core_rate: row.core,
  overall_rate: row.overall,
}))

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
    peerRankedBy: 'sessions_attended',
    onPeerRankedByChange: () => undefined,
    peerEntries,
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
