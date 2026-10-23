import type { Meta, StoryObj } from '@storybook/react'
import { Brand } from './Brand'

const meta: Meta<typeof Brand> = {
  title: 'Layout/Brand',
  component: Brand,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Brand>

export const Default: Story = {}
