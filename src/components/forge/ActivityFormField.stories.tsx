import type { Meta, StoryObj } from '@storybook/react'
import { ACTIVITY_FORMS } from '@/lib/activityForms'
import { ActivityFormField } from './ActivityFormField'

const eventFields = ACTIVITY_FORMS.event.fields
const fieldNamed = (name: string) => eventFields.filter((field) => field.name === name)[0]

const meta: Meta<typeof ActivityFormField> = {
  title: 'Forge/ActivityFormField',
  component: ActivityFormField,
  tags: ['autodocs'],
  args: { field: fieldNamed('name'), value: '', onChange: () => undefined, isMissing: false },
}

export default meta
type Story = StoryObj<typeof ActivityFormField>

export const Text: Story = {}
export const Missing: Story = { args: { isMissing: true } }
export const Segmented: Story = { args: { field: fieldNamed('role'), value: 'attendee' } }
// Built as designed but disabled until the API can store it
export const NotAvailable: Story = { args: { field: fieldNamed('pillar') } }
export const Chips: Story = {
  args: { field: ACTIVITY_FORMS.job.fields.filter((field) => field.name === 'support')[0] },
}
