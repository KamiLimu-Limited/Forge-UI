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
