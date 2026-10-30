import type { Meta, StoryObj } from '@storybook/react'
import { sampleHome, sampleHomeFirstMonth } from '../../../.storybook/menteeFixtures'
import { RanksCard } from './RanksCard'

const meta: Meta<typeof RanksCard> = {
  title: 'Forge/RanksCard',
  component: RanksCard,
  tags: ['autodocs'],
  args: { ranks: sampleHome.ranks },
}

export default meta
type Story = StoryObj<typeof RanksCard>

// Use the viewport toolbar: the title and link change at 375px and 1280px
export const Default: Story = {}
export const FirstMonth: Story = {
  args: { ranks: sampleHomeFirstMonth.ranks, showLeaderboardLink: false },
}
export const Empty: Story = { args: { ranks: [], showLeaderboardLink: false } }
