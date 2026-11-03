import type { Meta, StoryObj } from '@storybook/react'
import { sampleBoard } from '../../../.storybook/menteeFixtures'
import { LeaderboardBoards } from './LeaderboardBoards'

const meta: Meta<typeof LeaderboardBoards> = {
  title: 'Forge/LeaderboardBoards',
  component: LeaderboardBoards,
  tags: ['autodocs'],
  args: {
    dimension: 'core_attendance',
    onDimensionChange: () => undefined,
    entries: sampleBoard,
  },
}

export default meta
type Story = StoryObj<typeof LeaderboardBoards>

export const Default: Story = {}
export const Loading: Story = { args: { entries: null, isLoading: true } }
export const WithError: Story = {
  args: {
    entries: null,
    error: "We couldn't load the leaderboard. Try again.",
    onRetry: () => undefined,
  },
}
