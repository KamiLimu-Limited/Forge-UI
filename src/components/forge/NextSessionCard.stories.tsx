import type { Meta, StoryObj } from '@storybook/react'
import { sampleHome, sampleHomeFirstMonth } from '../../../.storybook/menteeFixtures'
import { NextSessionCard } from './NextSessionCard'

const meta: Meta<typeof NextSessionCard> = {
  title: 'Forge/NextSessionCard',
  component: NextSessionCard,
  tags: ['autodocs'],
  args: { session: sampleHome.nextSession },
}

export default meta
type Story = StoryObj<typeof NextSessionCard>

// Use the viewport toolbar: a button at 375px, a link at 1280px
export const Default: Story = {}
export const FirstMonth: Story = {
  args: { session: sampleHomeFirstMonth.nextSession, allSessionsInHeader: true },
}
export const Empty: Story = { args: { session: null } }
