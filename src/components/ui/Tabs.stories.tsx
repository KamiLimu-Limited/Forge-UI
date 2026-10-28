import type { Meta, StoryObj } from '@storybook/react'
import { Tabs } from './Tabs'

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { nextjs: { navigation: { pathname: '/admin/assignments' } } },
  args: {
    label: 'Assignment type',
    items: [
      { label: '1:1 peer mentor groups', href: '/admin/assignments' },
      { label: 'ICT peer mentors to tracks', href: '/admin/assignments/ict' },
      { label: 'Professional mentors to sessions', href: '/admin/assignments/professional' },
    ],
  },
}

export default meta
type Story = StoryObj<typeof Tabs>

export const FirstActive: Story = {}
export const LastActive: Story = {
  parameters: { nextjs: { navigation: { pathname: '/admin/assignments/professional' } } },
}
