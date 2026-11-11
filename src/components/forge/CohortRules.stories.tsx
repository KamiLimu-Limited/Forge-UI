import type { Meta, StoryObj } from '@storybook/react'
import { sampleCohort } from '../../../.storybook/fixtures'
import { useCohortForm } from '@/hooks/useCohortForm'
import { useCohortRules } from '@/hooks/useCohortRules'
import { CohortRules } from './CohortRules'

const meta: Meta<typeof CohortRules> = {
  title: 'Forge/CohortRules',
  component: CohortRules,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof CohortRules>

// Stories have no API, so the points start blank and there are no questions to edit
function Rules({ variant }: { variant: 'create' | 'settings' }) {
  const form = useCohortForm(
    variant === 'settings' ? { ...sampleCohort, ict_tracks: [], enrollment_counts: {} } : null
  )
  const rules = useCohortRules(null)
  return <CohortRules form={form} rules={rules} variant={variant} />
}

export const NewCohort: Story = { render: () => <Rules variant="create" /> }
export const Settings: Story = { render: () => <Rules variant="settings" /> }
