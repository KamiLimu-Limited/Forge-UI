import type { Meta, StoryObj } from '@storybook/react'
import { BackLink } from './BackLink'

const meta: Meta<typeof BackLink> = {
  title: 'UI/BackLink',
  component: BackLink,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BackLink>

export const Default: Story = {
  args: { href: '/admin/sessions', children: 'Back to the calendar' },
}
