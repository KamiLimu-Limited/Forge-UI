import type { Meta, StoryObj } from '@storybook/react'
import { EmailDeliveryScreen } from './EmailDeliveryScreen'

const meta: Meta<typeof EmailDeliveryScreen> = {
  title: 'Screens/Admin/EmailDelivery',
  component: EmailDeliveryScreen,
  parameters: { layout: 'padded' },
  args: {
    onPageChange: () => undefined,
    data: {
      total: 3,
      page: 1,
      pageSize: 20,
      rows: [
        {
          id: 'n-1',
          userId: 'u-1',
          name: 'Joy Mbugua',
          email: 'joy.m@example.com',
          type: 'cohort_onboarding_invitation',
          error: "Mailbox doesn't exist. Check the address.",
          attempts: 3,
          queuedAt: '2026-11-09T08:12:00+03:00',
        },
        {
          id: 'n-2',
          userId: 'u-2',
          name: 'Brian Kamau',
          email: 'brian.k@example.com',
          type: 'attendance_window_opening',
          error: 'Mailbox full',
          attempts: 3,
          queuedAt: '2026-11-08T17:31:00+03:00',
        },
        {
          id: 'n-3',
          userId: 'u-3',
          name: null,
          email: null,
          type: 'session_rescheduled',
          error: 'Temporary error from the receiving server',
          attempts: 3,
          queuedAt: '2026-11-02T18:02:00+03:00',
        },
      ],
    },
  },
}

export default meta
type Story = StoryObj<typeof EmailDeliveryScreen>

export const Default: Story = {}
export const NoneFailed: Story = { args: { data: { total: 0, page: 1, pageSize: 20, rows: [] } } }
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load the failed emails. Try again.",
    onRetry: () => undefined,
  },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
