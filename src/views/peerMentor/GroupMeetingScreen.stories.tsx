import type { Meta, StoryObj } from '@storybook/react'
import { sampleGroupMeeting } from '../../../.storybook/peerMentorFixtures'
import { GroupMeetingScreen } from './GroupMeetingScreen'

const draft = {
  mode: 'virtual' as const,
  date: '2026-08-26',
  startTime: '19:00',
  endTime: '22:00',
  place: '',
}

const meta: Meta<typeof GroupMeetingScreen> = {
  title: 'Screens/PeerMentor/GroupMeeting',
  component: GroupMeetingScreen,
  parameters: { layout: 'padded' },
  args: { data: sampleGroupMeeting, draft, onDraftChange: () => undefined },
}

export default meta
type Story = StoryObj<typeof GroupMeetingScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Virtual: Story = {}
export const Physical: Story = {
  args: { draft: { ...draft, mode: 'physical', place: 'Library, main campus' } },
}
export const NothingToPlan: Story = { args: { data: null } }
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load your group meeting. Try again.",
    onRetry: () => undefined,
  },
}
