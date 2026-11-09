import type { Meta, StoryObj } from '@storybook/react'
import { sampleCommitteeTrends } from '../../../.storybook/committeeFixtures'
import { TrendsScreen } from './TrendsScreen'

const meta: Meta<typeof TrendsScreen> = {
  title: 'Screens/Committee/Trends',
  component: TrendsScreen,
  parameters: { layout: 'padded' },
  args: { data: sampleCommitteeTrends },
}

export default meta
type Story = StoryObj<typeof TrendsScreen>

export const Default: Story = {}
export const FirstWeeks: Story = {
  args: {
    data: {
      ...sampleCommitteeTrends,
      monthRates: [],
      trackRates: [],
      ratingByMonth: [],
      activities: [],
      activitiesMax: 0,
    },
  },
}
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: { data: null, error: "We couldn't load the trends. Try again.", onRetry: () => undefined },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
