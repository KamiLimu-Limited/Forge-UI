import type { Meta, StoryObj } from '@storybook/react'
import { ProgressBar } from './ProgressBar'

const meta: Meta<typeof ProgressBar> = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  args: { value: 72, label: 'Attendance rate' },
}

export default meta
type Story = StoryObj<typeof ProgressBar>

export const Default: Story = {}
export const Empty: Story = { args: { value: 0 } }
export const Full: Story = { args: { value: 100 } }
// Values outside 0 to 100 are clamped so the bar never overflows
export const Clamped: Story = { args: { value: 140 } }
export const Narrow: Story = { args: { className: 'w-24' } }
