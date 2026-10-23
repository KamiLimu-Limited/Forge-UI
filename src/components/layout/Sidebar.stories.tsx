import type { Meta, StoryObj } from '@storybook/react'
import { Sidebar } from './Sidebar'

const meta: Meta<typeof Sidebar> = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { nextjs: { navigation: { pathname: '/admin/users' } } },
}

export default meta
type Story = StoryObj<typeof Sidebar>

export const Default: Story = {}
