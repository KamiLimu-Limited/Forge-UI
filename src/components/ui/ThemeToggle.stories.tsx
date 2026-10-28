import type { Meta, StoryObj } from '@storybook/react'
import { ThemeToggle } from './ThemeToggle'

const meta: Meta<typeof ThemeToggle> = {
  title: 'UI/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ThemeToggle>

// Click a button to switch the whole preview between light, dark and the device setting
export const Default: Story = {}
