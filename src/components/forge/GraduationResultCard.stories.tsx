import type { Meta, StoryObj } from '@storybook/react'
import { GraduationResultCard } from './GraduationResultCard'

const meta: Meta<typeof GraduationResultCard> = {
  title: 'Forge/GraduationResultCard',
  component: GraduationResultCard,
  parameters: { layout: 'padded' },
  args: {
    result: {
      firstName: 'Faith',
      cohortName: 'Cohort 11',
      graduated: true,
      graduatedOn: '2026-10-31',
      coreRate: 86,
      overallRate: 80,
      totalPoints: 702,
      sessionsAttended: 84,
      threshold: 80,
    },
  },
}

export default meta
type Story = StoryObj<typeof GraduationResultCard>

export const Graduated: Story = {}
export const NotGraduated: Story = {
  args: {
    result: {
      firstName: 'Kevin',
      cohortName: 'Cohort 11',
      graduated: false,
      graduatedOn: '2026-10-31',
      coreRate: 74,
      overallRate: 70,
      totalPoints: 590,
      sessionsAttended: 72,
      threshold: 80,
    },
  },
}
