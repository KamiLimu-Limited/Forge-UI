import type { Meta, StoryObj } from '@storybook/react'
import { PEER_MENTOR_SAVE_NOTE } from '@/lib/participation'
import { menteeUser } from '../../../.storybook/fixtures'
import { sampleSessionRecord, sampleSubmittedRecord } from '../../../.storybook/menteeFixtures'
import { AttendanceScreen } from './AttendanceScreen'

const meta: Meta<typeof AttendanceScreen> = {
  title: 'Screens/Mentee/Attendance',
  component: AttendanceScreen,
  parameters: {
    layout: 'padded',
    auth: { user: menteeUser },
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/dashboard/sessions/s-open-1/attendance' },
    },
  },
  args: { session: sampleSessionRecord, onSubmit: () => undefined },
}

export default meta
type Story = StoryObj<typeof AttendanceScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Default: Story = {}
// A submission is final for mentees, so there is no form
export const AlreadySubmitted: Story = { args: { session: sampleSubmittedRecord } }
export const Refused: Story = {
  args: { submitError: 'This session does not apply to you' },
}
export const WindowClosed: Story = {
  args: {
    session: { ...sampleSessionRecord, windowState: 'closed', closesInLabel: null },
  },
}
export const NotOpenYet: Story = {
  args: {
    session: { ...sampleSessionRecord, windowState: 'upcoming', closesInLabel: null },
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
// A 1:1 peer mentor using the same screen: everything shows, saving is switched off
export const AsPeerMentor: Story = { args: { saveBlockedNote: PEER_MENTOR_SAVE_NOTE } }
