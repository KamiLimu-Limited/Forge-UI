import type { Meta, StoryObj } from '@storybook/react'
import { sampleHome, sampleHomeFirstMonth } from '../../../.storybook/menteeFixtures'
import { StandingSummary } from './StandingSummary'

const meta: Meta<typeof StandingSummary> = {
  title: 'Forge/StandingSummary',
  component: StandingSummary,
  tags: ['autodocs'],
  args: { standing: sampleHome.standing, buckets: sampleHome.buckets },
}

export default meta
type Story = StoryObj<typeof StandingSummary>

// Use the viewport toolbar: one card plus four counts at 375px, four cards at 1280px
export const Default: Story = {}
export const FirstMonth: Story = {
  args: {
    standing: sampleHomeFirstMonth.standing,
    buckets: sampleHomeFirstMonth.buckets,
    showProgressLink: false,
  },
}
// Before any session has taken place
export const NoSessionsYet: Story = {
  args: {
    standing: { coreRate: null, overallRate: null, pointsEarned: 0, pointsPossible: 0 },
    buckets: { attended: 0, inProgress: 0, missed: 0, remaining: 101 },
    showProgressLink: false,
  },
}
