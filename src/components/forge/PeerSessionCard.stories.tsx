import type { Meta, StoryObj } from '@storybook/react'
import { samplePeerSession } from '../../../.storybook/peerMentorFixtures'
import { PeerSessionCard } from './PeerSessionCard'

const meta: Meta<typeof PeerSessionCard> = {
  title: 'Forge/PeerSessionCard',
  component: PeerSessionCard,
  tags: ['autodocs'],
  args: { session: samplePeerSession },
}

export default meta
type Story = StoryObj<typeof PeerSessionCard>

export const Open: Story = {}
export const AllSubmitted: Story = {
  args: { session: { ...samplePeerSession, windowLabel: 'Closed', isOpen: false, submitted: 3 } },
}
export const NotStarted: Story = {
  args: { session: { ...samplePeerSession, windowLabel: null, isOpen: false, submitted: 0 } },
}
export const NoneYet: Story = { args: { session: null } }
export const Loading: Story = { args: { session: null, isLoading: true } }
export const WithError: Story = {
  args: {
    session: null,
    error: "We couldn't load your peer mentorship session.",
    onRetry: () => undefined,
  },
}
