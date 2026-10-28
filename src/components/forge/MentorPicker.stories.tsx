import type { Meta, StoryObj } from '@storybook/react'
import { sampleMentors } from '../../../.storybook/fixtures'
import { MentorPicker } from './MentorPicker'

const meta: Meta<typeof MentorPicker> = {
  title: 'Forge/MentorPicker',
  component: MentorPicker,
  tags: ['autodocs'],
  args: {
    mentors: sampleMentors,
    leadId: 'm-1',
    coMentorIds: ['m-2'],
    onLeadChange: () => undefined,
    onCoMentorsChange: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof MentorPicker>

export const Populated: Story = {}
export const Loading: Story = {
  args: { mentors: [], isLoading: true, leadId: '', coMentorIds: [] },
}
export const Empty: Story = { args: { mentors: [], leadId: '', coMentorIds: [] } }
export const WithError: Story = {
  args: { mentors: [], leadId: '', coMentorIds: [], error: "We couldn't load the mentors." },
}
