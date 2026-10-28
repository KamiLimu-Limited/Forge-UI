import type { Meta, StoryObj } from '@storybook/react'
import { Notice } from './Notice'

const meta: Meta<typeof Notice> = {
  title: 'UI/Notice',
  component: Notice,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Notice>

export const Info: Story = {
  args: { children: 'ICT track and peer mentor aren’t part of the import.' },
}
export const Warning: Story = {
  args: { variant: 'warning', children: 'Changing the date or time reschedules the session.' },
}
export const Danger: Story = {
  args: { variant: 'danger', children: "The session didn't save. Try again." },
}
export const Success: Story = { args: { variant: 'success', children: '12 invitations sent.' } }
