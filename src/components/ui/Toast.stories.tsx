import type { Meta, StoryObj } from '@storybook/react'
import { Toast, ToastViewport } from './Toast'

const meta: Meta<typeof Toast> = {
  title: 'UI/Toast',
  component: Toast,
  tags: ['autodocs'],
  args: { onDismiss: () => undefined },
}

export default meta
type Story = StoryObj<typeof Toast>

export const Success: Story = {
  args: {
    toast: {
      id: 1,
      message: 'Session published. The cohort has been notified.',
      variant: 'success',
    },
  },
}
export const Error: Story = {
  args: { toast: { id: 2, message: "The session didn't save. Try again.", variant: 'error' } },
}
export const Info: Story = {
  args: { toast: { id: 3, message: 'Nothing to save. No changes were made.', variant: 'info' } },
}

export const Stacked: StoryObj<typeof ToastViewport> = {
  render: () => (
    <ToastViewport
      onDismiss={() => undefined}
      toasts={[
        { id: 1, message: 'Invitation sent to grace.wambui@example.com.', variant: 'success' },
        { id: 2, message: "The invitation wasn't resent. Try again.", variant: 'error' },
      ]}
    />
  ),
}
