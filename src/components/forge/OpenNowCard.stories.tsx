import type { Meta, StoryObj } from '@storybook/react'
import { sampleHome, sampleHomeFirstMonth } from '../../../.storybook/menteeFixtures'
import { OpenNowCard } from './OpenNowCard'

const meta: Meta<typeof OpenNowCard> = {
  title: 'Forge/OpenNowCard',
  component: OpenNowCard,
  tags: ['autodocs'],
  args: { sessions: sampleHome.openSessions },
}

export default meta
type Story = StoryObj<typeof OpenNowCard>

export const Default: Story = {}
export const WithoutLeader: Story = {
  args: { sessions: [{ ...sampleHome.openSessions[0], leaderName: null }] },
}
export const Empty: Story = { args: { sessions: sampleHomeFirstMonth.openSessions } }
