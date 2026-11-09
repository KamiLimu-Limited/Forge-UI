import type { Meta, StoryObj } from '@storybook/react'
import { menteeUser } from '../../../.storybook/fixtures'
import { ACTIVITY_FORMS } from '@/lib/activityForms'
import { ActivityFormScreen } from './ActivityFormScreen'

const meta: Meta<typeof ActivityFormScreen> = {
  title: 'Screens/Mentee/ActivityForm',
  component: ActivityFormScreen,
  parameters: {
    layout: 'padded',
    auth: { user: menteeUser },
    nextjs: { appDirectory: true, navigation: { pathname: '/dashboard/activities/new/event' } },
  },
  args: { config: ACTIVITY_FORMS.event },
}

export default meta
type Story = StoryObj<typeof ActivityFormScreen>

// Fields the API can't store yet are disabled with "Not available yet"
export const Event: Story = {}
export const Consultation: Story = { args: { config: ACTIVITY_FORMS.consultation } }
export const JobApplication: Story = { args: { config: ACTIVITY_FORMS.job } }
export const ScholarshipApplication: Story = { args: { config: ACTIVITY_FORMS.scholarship } }
export const Academia: Story = { args: { config: ACTIVITY_FORMS.academic } }
