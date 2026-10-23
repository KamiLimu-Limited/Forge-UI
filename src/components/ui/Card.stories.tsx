import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'
import { Button } from './Button'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

const body = (
  <p className="font-sans text-body text-text-secondary">
    Sessions run every Saturday from 9am. Bring your laptop.
  </p>
)

export const Default: Story = { args: { children: body } }

export const WithTitle: Story = { args: { title: 'Next session', children: body } }

export const WithAction: Story = {
  args: {
    title: 'Next session',
    action: (
      <Button size="sm" variant="secondary">
        View all
      </Button>
    ),
    children: body,
  },
}

export const Flush: Story = {
  args: {
    title: 'Members',
    flush: true,
    children: <div className="border-t border-border p-4 font-sans text-small">Edge to edge</div>,
  },
}
