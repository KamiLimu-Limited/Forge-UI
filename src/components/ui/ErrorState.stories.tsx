import type { Meta, StoryObj } from '@storybook/react'
import { ErrorState } from './ErrorState'

const meta: Meta<typeof ErrorState> = {
  title: 'UI/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ErrorState>

export const WithRetry: Story = {
  args: { message: "We couldn't load the sessions.", onRetry: () => undefined },
}
export const WithoutRetry: Story = { args: { message: "We couldn't find this session." } }
