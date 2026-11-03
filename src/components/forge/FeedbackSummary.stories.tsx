import type { Meta, StoryObj } from '@storybook/react'
import { sampleGroupFeedback } from '../../../.storybook/peerMentorFixtures'
import { FeedbackSummary } from './FeedbackSummary'

const meta: Meta<typeof FeedbackSummary> = {
  title: 'Forge/FeedbackSummary',
  component: FeedbackSummary,
  tags: ['autodocs'],
  args: { groups: sampleGroupFeedback.groups, feedback: sampleGroupFeedback.feedback },
}

export default meta
type Story = StoryObj<typeof FeedbackSummary>

export const WithAverage: Story = { args: { average: 4.6 } }
export const WithResponseCount: Story = { args: { showResponseCount: true } }
export const NoWrittenFeedback: Story = { args: { feedback: [] } }
