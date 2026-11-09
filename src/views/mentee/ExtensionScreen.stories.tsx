import type { Meta, StoryObj } from '@storybook/react'
import { PEER_MENTOR_SAVE_NOTE } from '@/lib/participation'
import { menteeUser } from '../../../.storybook/fixtures'
import {
  sampleExtensionApproved,
  sampleExtensionDenied,
  sampleExtensionNoRequest,
  sampleExtensionPending,
  sampleSessionRecord,
} from '../../../.storybook/menteeFixtures'
import { ExtensionScreen } from './ExtensionScreen'

const meta: Meta<typeof ExtensionScreen> = {
  title: 'Screens/Mentee/Extension',
  component: ExtensionScreen,
  parameters: {
    layout: 'padded',
    auth: { user: menteeUser },
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/dashboard/sessions/s-open-1/extension' },
    },
  },
  args: {
    data: sampleExtensionNoRequest,
    reason: '',
    onReasonChange: () => undefined,
    onSend: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof ExtensionScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const NoRequestYet: Story = {}
export const NoReason: Story = { args: { reasonError: 'Tell us why you need an extension' } }
export const SendFailed: Story = {
  args: { reason: 'I lost power', sendError: 'This session does not apply to you' },
}
export const Pending: Story = { args: { data: sampleExtensionPending } }
export const Approved: Story = { args: { data: sampleExtensionApproved } }
export const Denied: Story = { args: { data: sampleExtensionDenied } }
export const WindowStillOpen: Story = {
  args: { data: { session: sampleSessionRecord, request: null } },
}
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load this session. Try again.",
    onRetry: () => undefined,
  },
}
// A 1:1 peer mentor using the same screen: everything shows, saving is switched off
export const AsPeerMentor: Story = { args: { saveBlockedNote: PEER_MENTOR_SAVE_NOTE } }
