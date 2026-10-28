import type { Meta, StoryObj } from '@storybook/react'
import { ConfirmDialog } from './ConfirmDialog'

const meta: Meta<typeof ConfirmDialog> = {
  title: 'UI/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { isOpen: true, onClose: () => undefined, onConfirm: () => undefined },
}

export default meta
type Story = StoryObj<typeof ConfirmDialog>

export const Simple: Story = {
  args: {
    title: 'Remove this role?',
    confirmLabel: 'Remove role',
    variant: 'danger',
    children: <p>They will lose the Mentee role in Cohort 11 and the pages that come with it.</p>,
  },
}

export const WithRequiredReason: Story = {
  args: {
    title: 'Cancel this session?',
    confirmLabel: 'Cancel session',
    cancelLabel: 'Keep session',
    variant: 'danger',
    reason: {
      label: 'Reason',
      placeholder: 'For example, the facilitator is unavailable',
      required: true,
    },
    children: <p>Everyone enrolled and the assigned mentors get an email with your reason.</p>,
  },
}

export const Saving: Story = { args: { ...WithRequiredReason.args, isLoading: true } }

export const WithApiError: Story = {
  args: { ...WithRequiredReason.args, error: 'Activity has already been approved' },
}
