import type { Meta, StoryObj } from '@storybook/react'
import { BarList } from './BarList'

const meta: Meta<typeof BarList> = {
  title: 'UI/BarList',
  component: BarList,
  parameters: { layout: 'padded' },
  args: {
    max: 100,
    items: [
      { label: 'Core sessions', value: 86, display: '86%' },
      { label: 'Cloud Engineering', value: 88, display: '88%' },
      { label: 'Data Science', value: 79, display: '79%' },
    ],
  },
}

export default meta
type Story = StoryObj<typeof BarList>

export const Rates: Story = {}
export const Counts: Story = {
  args: {
    max: 96,
    items: [
      { label: 'External events', value: 96, display: '96' },
      { label: 'Consultations', value: 59, display: '59' },
    ],
  },
}
