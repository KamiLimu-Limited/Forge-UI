import type { Meta, StoryObj } from '@storybook/react'
import { menteeUser } from '../../../.storybook/fixtures'
import {
  sampleMonthProgress,
  sampleProgressSummary,
  sampleTrackProgress,
} from '../../../.storybook/menteeFixtures'
import { ProgressScreen } from './ProgressScreen'

const meta: Meta<typeof ProgressScreen> = {
  title: 'Screens/Mentee/Progress',
  component: ProgressScreen,
  parameters: {
    layout: 'padded',
    auth: { user: menteeUser },
    nextjs: { navigation: { pathname: '/dashboard/progress' } },
  },
  args: {
    summary: sampleProgressSummary,
    months: sampleMonthProgress,
    tracks: sampleTrackProgress,
  },
}

export default meta
type Story = StoryObj<typeof ProgressScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Default: Story = {}
export const Loading: Story = { args: { summary: null, months: [], tracks: [], isLoading: true } }
// Before any session has taken place
export const NoSessionsYet: Story = {
  args: { summary: { attended: 0, scheduled: 0, points: 0 }, months: [], tracks: [] },
}
export const WithError: Story = {
  args: {
    summary: null,
    months: [],
    tracks: [],
    error: "We couldn't load your progress. Try again.",
    onRetry: () => undefined,
  },
}
