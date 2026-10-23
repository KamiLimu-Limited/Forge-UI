import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Chip, type ChipVariant } from './Chip'

const meta: Meta<typeof Chip> = {
  title: 'UI/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'on', 'warn', 'ok', 'err', 'info', 'draft'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Chip>

export const Default: Story = { args: { children: 'Mentee' } }
export const On: Story = { args: { variant: 'on', children: 'Mentee' } }
export const Warn: Story = { args: { variant: 'warn', children: 'Pending' } }
export const Ok: Story = { args: { variant: 'ok', children: 'Active' } }
export const Err: Story = { args: { variant: 'err', children: 'Suspended' } }
export const Info: Story = { args: { variant: 'info', children: 'ICT track' } }
export const Draft: Story = { args: { variant: 'draft', children: 'Draft' } }

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(['default', 'on', 'warn', 'ok', 'err', 'info', 'draft'] as ChipVariant[]).map((v) => (
        <Chip key={v} variant={v}>
          {v}
        </Chip>
      ))}
    </div>
  ),
}

function ToggleDemo() {
  const [selected, setSelected] = useState(['Mentee'])
  const options = ['Mentee', '1:1 Peer Mentor', 'Committee']
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isOn = selected.includes(option)
        return (
          <Chip
            key={option}
            variant={isOn ? 'on' : 'default'}
            pressed={isOn}
            onClick={() =>
              setSelected((prev) => (isOn ? prev.filter((o) => o !== option) : [...prev, option]))
            }
          >
            {option}
          </Chip>
        )
      })}
    </div>
  )
}

export const Toggle: Story = { render: () => <ToggleDemo /> }

export const ToggleDisabled: Story = {
  args: { children: 'Admin', onClick: () => {}, disabled: true },
}
