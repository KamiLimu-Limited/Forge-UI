import type { Meta, StoryObj } from '@storybook/react'
import { sampleHome } from '../../../.storybook/menteeFixtures'
import { PeerMentorCard } from './PeerMentorCard'

const meta: Meta<typeof PeerMentorCard> = {
  title: 'Forge/PeerMentorCard',
  component: PeerMentorCard,
  tags: ['autodocs'],
  args: { name: sampleHome.peerMentorName, isAssigned: true },
}

export default meta
type Story = StoryObj<typeof PeerMentorCard>

export const Default: Story = {}
export const NotAssignedYet: Story = { args: { name: null, isAssigned: false } }
// Assigned, but the API doesn't return the name yet
export const NameNotAvailable: Story = { args: { name: null, isAssigned: true } }
