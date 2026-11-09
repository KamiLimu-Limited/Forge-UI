import type { Meta, StoryObj } from '@storybook/react'
import { sampleCommitteeOverview } from '../../../.storybook/committeeFixtures'
import { CommitteeOverviewScreen } from './CommitteeOverviewScreen'

const meta: Meta<typeof CommitteeOverviewScreen> = {
  title: 'Screens/Committee/Overview',
  component: CommitteeOverviewScreen,
  parameters: { layout: 'padded' },
  args: { data: sampleCommitteeOverview, trendsHref: '/dashboard/committee/trends' },
}

export default meta
type Story = StoryObj<typeof CommitteeOverviewScreen>

export const Default: Story = {}
export const NothingLoggedYet: Story = {
  args: {
    data: { ...sampleCommitteeOverview, trackRates: [], activities: [], activitiesMax: 0 },
  },
}
export const NoCohort: Story = { args: { data: null, hasCohort: false } }
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load the cohort overview. Try again.",
    onRetry: () => undefined,
  },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
