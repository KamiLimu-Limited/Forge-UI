import type { Meta, StoryObj } from '@storybook/react'
import { sampleCohort, sampleMentors, sampleSession } from '../../../.storybook/fixtures'
import { useSessionEditor } from '@/hooks/useSessionEditor'
import { SessionForm } from './SessionForm'

const meta: Meta<typeof SessionForm> = {
  title: 'Forge/SessionForm',
  component: SessionForm,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof SessionForm>

function Create() {
  const editor = useSessionEditor({ cohort: sampleCohort })
  return (
    <SessionForm
      values={editor.values}
      errors={editor.errors}
      onChange={editor.setValue}
      cohort={sampleCohort}
      mentors={sampleMentors}
    />
  )
}

function Edit({ withErrors }: { withErrors?: boolean }) {
  const editor = useSessionEditor({
    cohort: sampleCohort,
    session: { ...sampleSession, reschedule_history: null, attendance_window: null },
  })
  return (
    <SessionForm
      values={editor.values}
      errors={
        withErrors
          ? { title: 'Add a title.', end: 'The end must be after the start.' }
          : editor.errors
      }
      onChange={editor.setValue}
      cohort={sampleCohort}
      mentors={sampleMentors}
      isEdit
      timeChanged={editor.timeChanged}
    />
  )
}

export const NewSession: Story = { render: () => <Create /> }
export const EditSession: Story = { render: () => <Edit /> }
export const WithErrors: Story = { render: () => <Edit withErrors /> }
export const MentorsLoading: Story = {
  render: () => (
    <SessionForm
      values={{
        title: '',
        description: '',
        pillar: 'none',
        ictTrack: '',
        category: 'thursday',
        month: '',
        start: '',
        end: '',
        mode: 'virtual',
        location: '',
        points: 10,
        attendanceDeadline: '',
        leadMentorId: '',
        coMentorIds: [],
        resourceUrl: '',
        rescheduleReason: '',
      }}
      errors={{}}
      onChange={() => undefined}
      cohort={sampleCohort}
      mentors={[]}
      mentorsLoading
    />
  ),
}
