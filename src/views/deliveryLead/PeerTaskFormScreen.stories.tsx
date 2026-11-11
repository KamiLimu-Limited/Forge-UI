import type { Meta, StoryObj } from '@storybook/react'
import { samplePeerTaskForm } from '../../../.storybook/deliveryLeadFixtures'
import { PeerTaskFormScreen } from './PeerTaskFormScreen'

const meta: Meta<typeof PeerTaskFormScreen> = {
  title: 'Screens/DeliveryLead/TaskForm',
  component: PeerTaskFormScreen,
  parameters: { layout: 'padded' },
  args: {
    form: samplePeerTaskForm,
    draft: samplePeerTaskForm.initial,
    onChange: () => undefined,
    errors: {},
    onSave: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof PeerTaskFormScreen>

export const Edit: Story = {}
export const New: Story = {
  args: {
    form: { ...samplePeerTaskForm, sessionId: null, statusLabel: null },
    draft: { ...samplePeerTaskForm.initial, title: '', description: '', opensAt: '', dueAt: '' },
  },
}
export const WithProblems: Story = {
  args: {
    draft: { ...samplePeerTaskForm.initial, title: '', dueAt: '2026-09-10T09:00' },
    errors: { title: 'Give the task a title', dueAt: 'Due must be after it opens' },
  },
}
export const Loading: Story = { args: { form: null, draft: null, isLoading: true } }
export const WithError: Story = {
  args: {
    form: null,
    draft: null,
    error: "We couldn't load this task. Try again.",
    onRetry: () => undefined,
  },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
