import type { Meta, StoryObj } from '@storybook/react'
import { ButtonLink } from './ButtonLink'

const meta: Meta<typeof ButtonLink> = {
  title: 'UI/ButtonLink',
  component: ButtonLink,
  tags: ['autodocs'],
  args: { href: '/admin/sessions/new', children: 'New session' },
}

export default meta
type Story = StoryObj<typeof ButtonLink>

export const Primary: Story = {}
export const Secondary: Story = { args: { variant: 'secondary', children: 'Import CSV' } }
export const Small: Story = {
  args: { variant: 'secondary', size: 'sm', children: 'Assign peer mentor' },
}
