import type { Meta, StoryObj } from '@storybook/react'
import { samplePeerTasks } from '../../../.storybook/deliveryLeadFixtures'
import { PeerTasksScreen } from './PeerTasksScreen'

const meta: Meta<typeof PeerTasksScreen> = {
  title: 'Screens/DeliveryLead/Tasks',
  component: PeerTasksScreen,
  parameters: { layout: 'padded' },
  args: { data: samplePeerTasks, groupMeetingsHref: '/dashboard/group-meetings' },
}

export default meta
type Story = StoryObj<typeof PeerTasksScreen>

export const Default: Story = {}
export const NoTasks: Story = { args: { data: { cohortName: 'Cohort 11', tasks: [] } } }
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load the peer mentorship tasks. Try again.",
    onRetry: () => undefined,
  },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
