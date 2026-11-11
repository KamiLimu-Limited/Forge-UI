import type { Meta, StoryObj } from '@storybook/react'
import type { PeerMentorRow } from '@/types/leaderboard'
import { sampleCohortBoard } from '../../../.storybook/committeeFixtures'
import { CommitteeLeaderboardsScreen } from './CommitteeLeaderboardsScreen'

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

const meta: Meta<typeof CommitteeLeaderboardsScreen> = {
  title: 'Screens/Committee/Leaderboards',
  component: CommitteeLeaderboardsScreen,
  parameters: { layout: 'padded' },
  args: {
    tab: 'mentees',
    onTabChange: () => undefined,
    dimension: 'core_attendance',
    onDimensionChange: () => undefined,
    entries: sampleCohortBoard,
    onExport: () => undefined,
    peerRankedBy: 'sessions_attended',
    onPeerRankedByChange: () => undefined,
    peerEntries,
    snapshots: [
      { id: 'snap-1', label: 'Mentee leaderboard', takenAt: '2026-10-31T17:00:00+03:00' },
      { id: 'snap-2', label: 'Peer mentor leaderboard', takenAt: '2026-10-31T17:00:00+03:00' },
    ],
    onDownloadSnapshot: () => undefined,
    onTakeSnapshot: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof CommitteeLeaderboardsScreen>

export const Default: Story = {}
export const PeerMentors: Story = { args: { tab: 'peer-mentors' } }
export const NobodyRanked: Story = { args: { entries: [] } }
export const Exporting: Story = { args: { downloading: 'leaderboard' } }
export const NoCohort: Story = { args: { hasCohort: false } }
export const Loading: Story = { args: { entries: null, isLoading: true } }
export const WithError: Story = {
  args: {
    entries: null,
    error: "We couldn't load the leaderboard. Try again.",
    onRetry: () => undefined,
  },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
