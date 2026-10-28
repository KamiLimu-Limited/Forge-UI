import type { Meta, StoryObj } from '@storybook/react'
import { Steps } from './Steps'

const meta: Meta<typeof Steps> = {
  title: 'UI/Steps',
  component: Steps,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Steps>

export const InProgress: Story = {
  args: {
    steps: [
      { title: 'Upload the export', description: 'Users, sessions and attendance.', done: true },
      { title: 'Match the columns', description: 'All required columns matched.', done: true },
      { title: 'Check the numbers', description: 'Compare each mentee before you archive.' },
    ],
  },
}
export const NotStarted: Story = {
  args: { steps: (InProgress.args?.steps ?? []).map((s) => ({ ...s, done: false })) },
}
