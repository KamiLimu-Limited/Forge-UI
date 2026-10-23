import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['success', 'warning', 'danger', 'info', 'neutral'] },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Success: Story = { args: { variant: 'success', children: 'On track' } }
export const Warning: Story = { args: { variant: 'warning', children: 'Needs attention' } }
export const Danger: Story = { args: { variant: 'danger', children: 'At risk' } }
export const Info: Story = { args: { variant: 'info', children: 'ICT track' } }
export const Neutral: Story = { args: { variant: 'neutral', children: 'Draft' } }
