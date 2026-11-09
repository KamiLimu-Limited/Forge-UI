import type { Meta, StoryObj } from '@storybook/react'
import { sampleMenteeDetail } from '../../../.storybook/peerMentorFixtures'
import { MenteeDetailScreen } from './MenteeDetailScreen'

const meta: Meta<typeof MenteeDetailScreen> = {
  title: 'Screens/PeerMentor/MenteeDetail',
  component: MenteeDetailScreen,
  parameters: { layout: 'padded' },
  args: { detail: sampleMenteeDetail },
}

export default meta
type Story = StoryObj<typeof MenteeDetailScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Default: Story = {}
// The API refused the objectives or the group's records
export const PartlyUnavailable: Story = {
  args: { detail: { ...sampleMenteeDetail, objectives: null, feedback: null } },
}
export const NothingYet: Story = {
  args: { detail: { ...sampleMenteeDetail, attendance: [], objectives: [], feedback: [] } },
}
export const Loading: Story = { args: { detail: null, isLoading: true } }
export const WithError: Story = {
  args: {
    detail: null,
    error: "We couldn't load this mentee. Try again.",
    onRetry: () => undefined,
  },
}
