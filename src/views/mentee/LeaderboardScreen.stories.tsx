import type { Meta, StoryObj } from '@storybook/react'
import { menteeUser } from '../../../.storybook/fixtures'
import { sampleBoard } from '../../../.storybook/menteeFixtures'
import { LeaderboardScreen } from './LeaderboardScreen'

const meta: Meta<typeof LeaderboardScreen> = {
  title: 'Screens/Mentee/Leaderboard',
  component: LeaderboardScreen,
  parameters: { layout: 'padded', auth: { user: menteeUser } },
  args: {
    dimension: 'core_attendance',
    onDimensionChange: () => undefined,
    entries: sampleBoard,
  },
}

export default meta
type Story = StoryObj<typeof LeaderboardScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Default: Story = {}
export const NothingLogged: Story = {
  args: {
    dimension: 'academic',
    entries: sampleBoard.map((entry) => ({ ...entry, value: 0 })),
  },
}
export const Empty: Story = { args: { entries: [] } }
export const Loading: Story = { args: { entries: null, isLoading: true } }
export const WithError: Story = {
  args: {
    entries: null,
    error: "We couldn't load the leaderboard. Try again.",
    onRetry: () => undefined,
  },
}
