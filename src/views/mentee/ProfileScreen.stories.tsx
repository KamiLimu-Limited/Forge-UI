import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { menteeUser } from '../../../.storybook/fixtures'
import { useProfileForm } from '@/hooks/useProfileForm'
import type { MenteeProfileData } from '@/types/menteeProfile'
import { ProfileScreen } from './ProfileScreen'

const NO_FIELDS: MenteeProfileData['fields'] = {
  university: null,
  programme_of_study: null,
  degree_level: null,
  gender: null,
  phone: null,
  birthday: null,
  social_links: null,
}

const sample: MenteeProfileData = {
  name: 'Brian Kamau',
  email: 'brian.kamau@example.com',
  cohortLabel: 'Cohort 11, Mentee',
  ictTrack: 'Cybersecurity',
  hasPeerMentor: true,
  fields: { ...NO_FIELDS, university: 'University of Nairobi', degree_level: 'bachelors' },
}

type ScreenArgs = Omit<ComponentProps<typeof ProfileScreen>, 'profile'>

function WithForm(args: ScreenArgs) {
  const profile = useProfileForm(args.data?.fields ?? null)
  return <ProfileScreen {...args} profile={profile} />
}

const meta: Meta<typeof ProfileScreen> = {
  title: 'Screens/Mentee/Profile',
  component: ProfileScreen,
  parameters: { layout: 'padded', auth: { user: menteeUser } },
  args: { data: sample, onSignOut: () => undefined, onSaveProfile: () => undefined },
  render: (args) => <WithForm {...args} />,
}

export default meta
type Story = StoryObj<typeof ProfileScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Default: Story = {}
export const NewMentee: Story = {
  args: { data: { ...sample, ictTrack: null, hasPeerMentor: false, fields: NO_FIELDS } },
}
export const Saving: Story = { args: { isSavingProfile: true } }
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load your profile. Try again.",
    onRetry: () => undefined,
  },
}
