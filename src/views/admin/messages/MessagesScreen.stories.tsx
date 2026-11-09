import type { Meta, StoryObj } from '@storybook/react'
import { MessagesScreen } from './MessagesScreen'

const meta: Meta<typeof MessagesScreen> = {
  title: 'Screens/Admin/Messages',
  component: MessagesScreen,
  parameters: { layout: 'padded' },
  args: {
    cohortName: 'Cohort 11',
    draft: { target: 'cohort', roleGroup: 'all', subject: '', message: '' },
    onChange: () => undefined,
    recipients: 68,
    errors: {},
    onReview: () => undefined,
    isConfirming: false,
    onCancel: () => undefined,
    onSend: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof MessagesScreen>

export const Empty: Story = {}
export const ToARole: Story = {
  args: {
    draft: {
      target: 'cohort-role',
      roleGroup: 'mentees',
      subject: "Saturday's in-person session venue",
      message: 'We meet at the usual hall at 9:00 AM.',
    },
    recipients: 40,
  },
}
export const MissingFields: Story = {
  args: { errors: { subject: 'Write a subject', message: 'Write the message' } },
}
export const Confirming: Story = {
  args: { ...ToARole.args, isConfirming: true },
}
export const SendFailed: Story = {
  args: { ...ToARole.args, isConfirming: true, sendError: 'Title is required' },
}
export const AlumniCountUnknown: Story = {
  args: {
    draft: { target: 'alumni', roleGroup: 'all', subject: '', message: '' },
    recipients: null,
  },
}
