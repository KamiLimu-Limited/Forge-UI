import type { Meta, StoryObj } from '@storybook/react'
import { LoadingState } from './LoadingState'

const meta: Meta<typeof LoadingState> = {
  title: 'UI/LoadingState',
  component: LoadingState,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof LoadingState>

export const Default: Story = { args: { label: 'Loading sessions' } }
