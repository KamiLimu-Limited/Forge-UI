import type { Meta, StoryObj } from '@storybook/react'
import { SessionViewTabs } from './SessionViewTabs'

const meta: Meta<typeof SessionViewTabs> = {
  title: 'Forge/SessionViewTabs',
  component: SessionViewTabs,
  tags: ['autodocs'],
  parameters: { nextjs: { appDirectory: true, navigation: { pathname: '/dashboard/sessions' } } },
}

export default meta
type Story = StoryObj<typeof SessionViewTabs>

// Use the viewport toolbar: two options at 375px, tabs at 1280px
export const OpenAndUpcoming: Story = {}
export const History: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: '/dashboard/sessions/history' } },
  },
}
