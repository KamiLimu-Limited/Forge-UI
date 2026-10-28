import type { Meta, StoryObj } from '@storybook/react'
import { archivedCohort, sampleCohort } from '../../../.storybook/fixtures'
import { InviteUserForm } from './InviteUserForm'

const meta: Meta<typeof InviteUserForm> = {
  title: 'Forge/InviteUserForm',
  component: InviteUserForm,
  tags: ['autodocs'],
  args: {
    cohorts: [sampleCohort, archivedCohort],
    defaultCohortId: sampleCohort.id,
    onInvited: () => undefined,
    onCancel: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof InviteUserForm>

export const AnyRole: Story = {}
export const ProfessionalMentor: Story = {
  args: { fixedRole: 'professional_mentor', title: 'Add professional mentor' },
}
export const NoCohorts: Story = { args: { cohorts: [], defaultCohortId: null } }
