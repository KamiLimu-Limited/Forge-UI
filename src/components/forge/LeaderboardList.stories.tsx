import type { Meta, StoryObj } from '@storybook/react'
import { sampleBoard } from '../../../.storybook/menteeFixtures'
import { LeaderboardList } from './LeaderboardList'

const meta: Meta<typeof LeaderboardList> = {
  title: 'Forge/LeaderboardList',
  component: LeaderboardList,
  tags: ['autodocs'],
  args: { dimension: 'core_attendance', entries: sampleBoard },
}

export default meta
type Story = StoryObj<typeof LeaderboardList>

// Use the viewport toolbar: a list at 375px, a table at 1280px
export const Shortened: Story = {}
export const ShortBoard: Story = { args: { entries: sampleBoard.slice(0, 5) } }
export const CountsNotRates: Story = { args: { dimension: 'events' } }
export const Empty: Story = { args: { entries: [] } }
