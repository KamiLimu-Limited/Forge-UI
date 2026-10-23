import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = { args: { name: 'Amina Otieno' } }
export const SingleName: Story = { args: { name: 'Wanjiru' } }
export const NoName: Story = { args: { name: '' } }
