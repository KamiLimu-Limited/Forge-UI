import type { Meta, StoryObj } from '@storybook/react'
import { TextLink } from './TextLink'

const meta: Meta<typeof TextLink> = {
  title: 'UI/TextLink',
  component: TextLink,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TextLink>

export const Block: Story = { args: { href: '/login', children: 'Back to sign in' } }
export const Inline: Story = {
  args: { href: '/forgot-password', children: 'Forgot password?', layout: 'inline' },
}
