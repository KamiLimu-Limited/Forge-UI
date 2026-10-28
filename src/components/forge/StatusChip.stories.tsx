import type { Meta, StoryObj } from '@storybook/react'
import { StatusChip } from './StatusChip'

const meta: Meta<typeof StatusChip> = {
  title: 'Forge/StatusChip',
  component: StatusChip,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StatusChip>

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <StatusChip kind="account" status="active" />
        <StatusChip kind="account" status="pending" />
        <StatusChip kind="account" status="suspended" />
        <StatusChip kind="invitation" status="pending" />
      </div>
      <div className="flex flex-wrap gap-2">
        <StatusChip kind="session" status="draft" />
        <StatusChip kind="session" status="published" />
        <StatusChip kind="session" status="published" isLive />
        <StatusChip kind="session" status="completed" />
        <StatusChip kind="session" status="cancelled" />
      </div>
      <div className="flex flex-wrap gap-2">
        <StatusChip kind="attendance" status="attended" />
        <StatusChip kind="attendance" status="not_attended" />
        <StatusChip kind="attendance" status="missed" />
        <StatusChip kind="attendance" status="excused" />
        <StatusChip kind="attendance" status="pending" />
      </div>
      <div className="flex flex-wrap gap-2">
        <StatusChip kind="override" status="pending" />
        <StatusChip kind="override" status="approved" />
        <StatusChip kind="override" status="denied" />
        <StatusChip kind="activity" status="rejected" />
        <StatusChip kind="cohort" status="draft" />
        <StatusChip kind="cohort" status="active" />
        <StatusChip kind="cohort" status="completed" />
      </div>
    </div>
  ),
}
