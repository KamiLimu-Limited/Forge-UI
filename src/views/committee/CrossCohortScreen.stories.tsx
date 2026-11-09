import type { Meta, StoryObj } from '@storybook/react'
import { sampleCrossCohort } from '../../../.storybook/committeeFixtures'
import { CrossCohortScreen } from './CrossCohortScreen'

const meta: Meta<typeof CrossCohortScreen> = {
  title: 'Screens/Committee/CrossCohort',
  component: CrossCohortScreen,
  parameters: { layout: 'padded' },
  args: { data: sampleCrossCohort, onCompareWith: () => undefined },
}

export default meta
type Story = StoryObj<typeof CrossCohortScreen>

export const Default: Story = {}
export const FirstCohort: Story = {
  args: { data: { ...sampleCrossCohort, other: null, options: [] } },
}
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load the comparison. Try again.",
    onRetry: () => undefined,
  },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
