import type { Meta, StoryObj } from '@storybook/react'
import { CohortRulesUnavailable } from './CohortRulesUnavailable'

const meta: Meta<typeof CohortRulesUnavailable> = {
  title: 'Forge/CohortRulesUnavailable',
  component: CohortRulesUnavailable,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CohortRulesUnavailable>

export const NewCohort: Story = { args: { variant: 'create' } }
export const Settings: Story = { args: { variant: 'settings' } }
