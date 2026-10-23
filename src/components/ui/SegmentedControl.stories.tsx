import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SegmentedControl } from './SegmentedControl'

type Filter = 'all' | 'active' | 'pending' | 'suspended'

const options: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
]

function Demo({ disabled = false }: { disabled?: boolean }) {
  const [value, setValue] = useState<Filter>('all')
  return (
    <SegmentedControl
      label="Filter users by status"
      options={options}
      value={value}
      onChange={setValue}
      disabled={disabled}
    />
  )
}

const meta: Meta<typeof Demo> = {
  title: 'UI/SegmentedControl',
  component: Demo,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Demo>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
