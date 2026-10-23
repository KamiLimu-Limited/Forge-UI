import type { Meta, StoryObj } from '@storybook/react'
import { TopBar } from './TopBar'

// TopBar is a deprecated alias of PageHeader. See Layout/PageHeader for every state.
const meta: Meta<typeof TopBar> = {
  title: 'Layout/TopBar (deprecated)',
  component: TopBar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TopBar>

export const Default: Story = { args: { title: 'Users' } }
