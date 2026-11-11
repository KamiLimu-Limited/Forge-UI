import type { Meta, StoryObj } from '@storybook/react'
import type { PeerMentorRow } from '@/types/leaderboard'
import { PeerMentorBoard } from './PeerMentorBoard'

// Sample peer mentors for stories. Not real people.
const entries: PeerMentorRow[] = [
  ['Wanjiru Mwangi', 14, 3, 100, 104],
  ['Hansel Omondi', 13, 5, 93, 101],
  ['Achieng Odhiambo', 12, 1, 86, 88],
].map(([name, attended, extra, core, overall], index) => ({
  rank: index + 1,
  peer_mentor_id: `pm-${index}`,
  display_name: name as string,
  is_me: index === 1,
  sessions_attended: attended as number,
  extra_sessions: extra as number,
  core_rate: core as number,
  overall_rate: overall as number,
}))

const meta: Meta<typeof PeerMentorBoard> = {
  title: 'Forge/PeerMentorBoard',
  component: PeerMentorBoard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { rankedBy: 'sessions_attended', onRankedByChange: () => undefined, entries },
}

export default meta
type Story = StoryObj<typeof PeerMentorBoard>

export const Ranked: Story = {}
export const Empty: Story = { args: { entries: [] } }
export const Loading: Story = { args: { entries: null, isLoading: true } }
export const WithError: Story = {
  args: { entries: null, error: "We couldn't load the leaderboard.", onRetry: () => undefined },
}
