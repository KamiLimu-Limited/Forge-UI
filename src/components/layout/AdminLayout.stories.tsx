import type { Meta, StoryObj } from '@storybook/react'
import { AdminLayout } from './AdminLayout'

const meta: Meta<typeof AdminLayout> = {
  title: 'Layout/AdminLayout',
  component: AdminLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', nextjs: { navigation: { pathname: '/admin/users' } } },
}

export default meta
type Story = StoryObj<typeof AdminLayout>

export const Default: Story = {
  args: {
    children: <div className="p-6 font-sans text-body text-text-secondary">Page content</div>,
  },
}
