import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { sampleMentors } from '../../../.storybook/fixtures'
import { CoMentorPicker } from './CoMentorPicker'

const meta: Meta<typeof CoMentorPicker> = {
  title: 'Forge/CoMentorPicker',
  component: CoMentorPicker,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CoMentorPicker>

function Interactive({ initial }: { initial: string[] }) {
  const [ids, setIds] = useState(initial)
  return (
    <CoMentorPicker
      label="Co-mentors"
      mentors={sampleMentors}
      selectedIds={ids}
      onChange={setIds}
    />
  )
}

export const NoneChosen: Story = { render: () => <Interactive initial={[]} /> }
export const OneChosen: Story = { render: () => <Interactive initial={['m-2']} /> }
export const NoMentors: Story = {
  args: { label: 'Co-mentors', mentors: [], selectedIds: [], onChange: () => undefined },
}
