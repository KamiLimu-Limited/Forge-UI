import type { Meta, StoryObj } from '@storybook/react'
import { AttendanceStateChip } from './AttendanceStateChip'

const meta: Meta<typeof AttendanceStateChip> = {
  title: 'Forge/AttendanceStateChip',
  component: AttendanceStateChip,
  tags: ['autodocs'],
  args: { state: 'attended' },
}

export default meta
type Story = StoryObj<typeof AttendanceStateChip>

export const Present: Story = {}
export const Absent: Story = { args: { state: 'not_attended' } }
export const Missed: Story = { args: { state: 'missed' } }
export const Excused: Story = { args: { state: 'excused' } }
