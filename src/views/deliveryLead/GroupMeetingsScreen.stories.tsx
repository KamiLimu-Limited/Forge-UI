import type { Meta, StoryObj } from '@storybook/react'
import { sampleGroupMeetings } from '../../../.storybook/deliveryLeadFixtures'
import { GroupMeetingsScreen } from './GroupMeetingsScreen'

const meta: Meta<typeof GroupMeetingsScreen> = {
  title: 'Screens/DeliveryLead/GroupMeetings',
  component: GroupMeetingsScreen,
  parameters: { layout: 'padded' },
  args: { data: sampleGroupMeetings, onTaskChange: () => undefined },
}

export default meta
type Story = StoryObj<typeof GroupMeetingsScreen>

export const Default: Story = {}
export const NoGroups: Story = { args: { data: { ...sampleGroupMeetings, groups: [] } } }
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load the group meetings. Try again.",
    onRetry: () => undefined,
  },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
