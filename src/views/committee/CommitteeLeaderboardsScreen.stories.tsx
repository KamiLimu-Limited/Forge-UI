import type { Meta, StoryObj } from '@storybook/react'
import { sampleCohortBoard } from '../../../.storybook/committeeFixtures'
import { CommitteeLeaderboardsScreen } from './CommitteeLeaderboardsScreen'

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
