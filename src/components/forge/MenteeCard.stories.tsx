import type { Meta, StoryObj } from '@storybook/react'
import { MenteeCard } from './MenteeCard'

const meta: Meta<typeof MenteeCard> = {
  title: 'Forge/MenteeCard',
  component: MenteeCard,
  tags: ['autodocs'],
  args: {
    id: 'e-1',
    name: 'Wanjiku Kamau',
    detail: 'wanjiku@example.com',
    value: '',
    onAssign: () => undefined,
    options: [
      { value: '', label: 'Assign to' },
      { value: 'm-3', label: 'Achieng Odhiambo (2 of 3)' },
      { value: 'm-4', label: 'Brian Kiprop (3 of 3)', disabled: true },
    ],
  },
}

export default meta
type Story = StoryObj<typeof MenteeCard>

export const Unassigned: Story = {}
export const MovedNotSaved: Story = { args: { value: 'm-3', isChanged: true } }
export const Saving: Story = { args: { disabled: true } }
