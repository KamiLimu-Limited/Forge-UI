import type { Meta, StoryObj } from '@storybook/react'
import { sampleProSessions } from '../../../.storybook/proMentorFixtures'
import { ProSessionsScreen } from './ProSessionsScreen'

const meta: Meta<typeof ProSessionsScreen> = {
  title: 'Screens/ProMentor/Sessions',
  component: ProSessionsScreen,
  parameters: { layout: 'padded' },
  args: { data: sampleProSessions },
}

export default meta
type Story = StoryObj<typeof ProSessionsScreen>

export const Default: Story = {}
export const OnlyUpcoming: Story = { args: { data: { ...sampleProSessions, past: [] } } }
export const NoSessions: Story = {
  args: { data: { cohortName: 'Cohort 11', upcoming: [], past: [] } },
}
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load your sessions. Try again.",
    onRetry: () => undefined,
  },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
