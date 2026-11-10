import type { Meta, StoryObj } from '@storybook/react'
import { sampleCohortNumbers } from '../../../.storybook/committeeFixtures'
import { CohortNumbersRow } from './CohortNumbersRow'

const meta: Meta<typeof CohortNumbersRow> = {
  title: 'Forge/CohortNumbersRow',
  component: CohortNumbersRow,
  parameters: { layout: 'padded' },
  args: { numbers: sampleCohortNumbers },
}

export default meta
type Story = StoryObj<typeof CohortNumbersRow>

export const Default: Story = {}
export const WithNotes: Story = { args: { withNotes: true } }
// Rates arrive from the API as 0 to 100 and are shown as they are, never scaled
export const RatesAtZero: Story = {
  args: { numbers: { ...sampleCohortNumbers, coreRate: 0, overallRate: 0 } },
}
export const RatesAtHalf: Story = {
  args: { numbers: { ...sampleCohortNumbers, coreRate: 50, overallRate: 50 } },
}
export const RatesAtFull: Story = {
  args: { numbers: { ...sampleCohortNumbers, coreRate: 100, overallRate: 100 } },
}
// Shows "1%" and "0%": a small value is a small percentage, not a fraction to multiply
export const RatesUnderOnePercent: Story = {
  args: { numbers: { ...sampleCohortNumbers, coreRate: 0.85, overallRate: 0.4 } },
}
export const NoAttendanceYet: Story = {
  args: {
    numbers: {
      ...sampleCohortNumbers,
      coreRate: null,
      overallRate: null,
      pointsDistributed: 0,
      sessionsCompleted: 0,
    },
  },
}
