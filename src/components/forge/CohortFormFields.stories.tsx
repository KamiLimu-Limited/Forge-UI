import type { Meta, StoryObj } from '@storybook/react'
import { sampleCohort } from '../../../.storybook/fixtures'
import { useCohortForm } from '@/hooks/useCohortForm'
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
  return <CohortFormFields form={form} variant="create" />
}

function Settings() {
  const form = useCohortForm({ ...sampleCohort, enrollment_counts: { mentee: 40 } })
  return <CohortFormFields form={form} variant="settings" />
}

export const Create: Story = { render: () => <NewCohort /> }
export const EditSettings: Story = { render: () => <Settings /> }
