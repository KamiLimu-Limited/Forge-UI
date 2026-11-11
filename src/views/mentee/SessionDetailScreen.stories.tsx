import type { Meta, StoryObj } from '@storybook/react'
import { sampleSessionDetail } from '../../../.storybook/menteeFixtures'
import { SessionDetailScreen } from './SessionDetailScreen'

const meta: Meta<typeof SessionDetailScreen> = {
  title: 'Screens/Mentee/SessionDetail',
  component: SessionDetailScreen,
  parameters: { layout: 'padded' },
  args: { session: sampleSessionDetail },
}

export default meta
type Story = StoryObj<typeof SessionDetailScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Upcoming: Story = {}
export const OpenNow: Story = {
  args: { session: { ...sampleSessionDetail, windowState: 'open', startsSoonLabel: null } },
}
export const Submitted: Story = {
  args: { session: { ...sampleSessionDetail, windowState: 'open', recordState: 'present' } },
}
export const Missed: Story = {
  args: { session: { ...sampleSessionDetail, windowState: 'closed', startsSoonLabel: null } },
}
export const InPerson: Story = {
  args: {
    session: {
      ...sampleSessionDetail,
      isVirtual: false,
      whereLabel: 'iHub, Nairobi',
      movedNote: null,
      mentors: [],
      materials: [],
    },
  },
}
export const Loading: Story = { args: { session: null, isLoading: true } }
export const WithError: Story = {
  args: {
    session: null,
    error: "We couldn't load this session. Try again.",
    onRetry: () => undefined,
  },
}
