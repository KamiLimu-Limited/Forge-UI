import type { Meta, StoryObj } from '@storybook/react'
import { StatTile } from './StatTile'

const meta: Meta<typeof StatTile> = {
  title: 'UI/StatTile',
  component: StatTile,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StatTile>

export const Default: Story = { args: { label: 'Sessions attended', value: 14 } }
export const WithNote: Story = {
  args: { label: 'Sessions attended', value: 14, note: 'Out of 18 so far' },
}
export const Loading: Story = { args: { label: 'Sessions attended', value: null, isLoading: true } }
export const Empty: Story = { args: { label: 'Sessions attended', value: null } }
export const WithError: Story = {
  args: { label: 'Sessions attended', value: null, error: 'Could not load this number.' },
}
export const AsLink: Story = {
  args: {
    label: 'Pending override requests',
    value: 3,
    href: '/admin/attendance-queue',
    linkLabel: 'Open the queue',
  },
}
