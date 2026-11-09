import type { Meta, StoryObj } from '@storybook/react'
import { sampleGroupFeedback } from '../../../.storybook/peerMentorFixtures'
import { GroupFeedbackScreen } from './GroupFeedbackScreen'

const meta: Meta<typeof GroupFeedbackScreen> = {
  title: 'Screens/PeerMentor/GroupFeedback',
  component: GroupFeedbackScreen,
  parameters: { layout: 'padded' },
  args: { data: sampleGroupFeedback },
}

export default meta
type Story = StoryObj<typeof GroupFeedbackScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Default: Story = {}
export const NoRatingsYet: Story = {
  args: {
    data: {
      ...sampleGroupFeedback,
      submitted: 0,
      average: null,
      groups: sampleGroupFeedback.groups.map((group) => ({
        ...group,
        questions: group.questions.map((question) => ({ ...question, average: null })),
      })),
      feedback: [],
    },
  },
}
export const NoWrittenFeedback: Story = { args: { data: { ...sampleGroupFeedback, feedback: [] } } }
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load your group's feedback. Try again.",
    onRetry: () => undefined,
  },
}
