import type { Meta, StoryObj } from '@storybook/react'
import { Landing } from './Landing'

const meta: Meta<typeof Landing> = {
  title: 'Screens/Landing',
  component: Landing,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof Landing>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop)
export const Default: Story = {}
