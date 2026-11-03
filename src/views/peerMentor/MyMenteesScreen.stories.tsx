import type { Meta, StoryObj } from '@storybook/react'
import { sampleGroup } from '../../../.storybook/peerMentorFixtures'
import { MyMenteesScreen } from './MyMenteesScreen'

const meta: Meta<typeof MyMenteesScreen> = {
  title: 'Screens/PeerMentor/MyMentees',
  component: MyMenteesScreen,
  parameters: { layout: 'padded' },
  args: { mentees: sampleGroup },
}

export default meta
type Story = StoryObj<typeof MyMenteesScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Default: Story = {}
export const NoGroupYet: Story = { args: { mentees: [] } }
export const Loading: Story = { args: { mentees: null, isLoading: true } }
export const WithError: Story = {
  args: {
    mentees: null,
    error: "We couldn't load your mentees. Try again.",
    onRetry: () => undefined,
  },
}
