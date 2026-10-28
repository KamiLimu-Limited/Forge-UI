import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import { DangerZone } from './DangerZone'

const meta: Meta<typeof DangerZone> = {
  title: 'UI/DangerZone',
  component: DangerZone,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DangerZone>

export const Default: Story = {
  args: {
    title: 'Cancel this session',
    description:
      "Cancelled sessions don't count towards anyone's attendance rate. Everyone enrolled and the assigned mentors are emailed.",
    action: <Button variant="danger">Cancel session</Button>,
  },
}
