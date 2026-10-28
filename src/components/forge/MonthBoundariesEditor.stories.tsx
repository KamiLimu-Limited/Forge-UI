import type { Meta, StoryObj } from '@storybook/react'
import { Card } from '@/components/ui/Card'
import { MonthBoundariesEditor } from './MonthBoundariesEditor'

const meta: Meta<typeof MonthBoundariesEditor> = {
  title: 'Forge/MonthBoundariesEditor',
  component: MonthBoundariesEditor,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Card flush title="KamiLimu months">
        {Story()}
      </Card>
    ),
  ],
  args: {
    onChange: () => undefined,
    onRemove: () => undefined,
    months: [
      { key: 'a', month: 1, name: '', start: '2026-03-26', end: '2026-04-25' },
      { key: 'b', month: 2, name: '', start: '2026-04-26', end: '2026-05-25' },
      { key: 'c', month: 2, name: 'Month 2 Break', start: '', end: '' },
    ],
  },
}

export default meta
type Story = StoryObj<typeof MonthBoundariesEditor>

export const Populated: Story = {}
export const Empty: Story = { args: { months: [] } }
export const WithError: Story = {
  args: { error: 'Month 2 needs both a start and an end date, or neither.' },
}
