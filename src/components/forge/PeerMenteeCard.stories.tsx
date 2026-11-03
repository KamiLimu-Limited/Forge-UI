import type { Meta, StoryObj } from '@storybook/react'
import { sampleGroup } from '../../../.storybook/peerMentorFixtures'
import { PeerMenteeCard } from './PeerMenteeCard'

const meta: Meta<typeof PeerMenteeCard> = {
  title: 'Forge/PeerMenteeCard',
  component: PeerMenteeCard,
  tags: ['autodocs'],
  args: { mentee: sampleGroup[0] },
}

export default meta
type Story = StoryObj<typeof PeerMenteeCard>

export const Default: Story = {}
