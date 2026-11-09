import type { Meta, StoryObj } from '@storybook/react'
import { ColumnChart } from './ColumnChart'

const meta: Meta<typeof ColumnChart> = {
  title: 'UI/ColumnChart',
  component: ColumnChart,
  parameters: { layout: 'padded' },
  args: {
    label: 'Core attendance by month',
    max: 100,
    items: [92, 88, 85, 81, 79, null, null, null].map((value, index) => ({
      label: `M${index + 1}`,
      value,
      display: value === null ? '' : `${value}%`,
    })),
  },
}

export default meta
type Story = StoryObj<typeof ColumnChart>

export const MonthsSoFar: Story = {}
export const Counts: Story = {
  args: {
    label: 'Extra activities by type',
    max: 96,
    items: [
      { label: 'Events', value: 96, display: '96' },
      { label: 'Consultations', value: 59, display: '59' },
      { label: 'Applications', value: 52, display: '52' },
      { label: 'Academia', value: 38, display: '38' },
    ],
  },
}
