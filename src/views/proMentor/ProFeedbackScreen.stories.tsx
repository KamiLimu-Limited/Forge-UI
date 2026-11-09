import type { Meta, StoryObj } from '@storybook/react'
import { sampleProFeedback, sampleProSessions } from '../../../.storybook/proMentorFixtures'
import { ProFeedbackScreen } from './ProFeedbackScreen'

const meta: Meta<typeof ProFeedbackScreen> = {
  title: 'Screens/ProMentor/Feedback',
  component: ProFeedbackScreen,
  parameters: { layout: 'padded' },
  args: {
    sessions: sampleProSessions.past,
    selectedId: sampleProSessions.past[0].id,
    onSelect: () => undefined,
    feedback: sampleProFeedback,
  },
}

export default meta
type Story = StoryObj<typeof ProFeedbackScreen>

export const Default: Story = {}
export const NoRatings: Story = {
  args: { feedback: { ...sampleProFeedback, responses: 0, average: null, feedback: [] } },
}
export const NoPastSessions: Story = { args: { sessions: [], selectedId: null, feedback: null } }
export const Loading: Story = { args: { sessions: null, feedback: null, isLoading: true } }
export const WithError: Story = {
  args: {
    sessions: null,
    feedback: null,
    error: "We couldn't load this feedback. Try again.",
    onRetry: () => undefined,
  },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
