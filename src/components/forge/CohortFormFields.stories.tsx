import type { Meta, StoryObj } from '@storybook/react'
import { sampleCohort } from '../../../.storybook/fixtures'
import { useCohortForm } from '@/hooks/useCohortForm'
import { useCohortRules } from '@/hooks/useCohortRules'
import { CohortFormFields } from './CohortFormFields'

const meta: Meta<typeof CohortFormFields> = {
  title: 'Forge/CohortFormFields',
  component: CohortFormFields,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof CohortFormFields>

function NewCohort() {
  const form = useCohortForm(null)
  const rules = useCohortRules(null)
  return <CohortFormFields form={form} rules={rules} variant="create" />
}

function Settings() {
  const form = useCohortForm({ ...sampleCohort, ict_tracks: [], enrollment_counts: { mentee: 40 } })
  // Stories have no API, so the points and questions start blank
  const rules = useCohortRules(null)
  return <CohortFormFields form={form} rules={rules} variant="settings" />
}

export const Create: Story = { render: () => <NewCohort /> }
export const EditSettings: Story = { render: () => <Settings /> }
