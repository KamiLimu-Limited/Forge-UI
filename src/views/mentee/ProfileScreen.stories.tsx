import type { Meta, StoryObj } from '@storybook/react'
import { menteeUser } from '../../../.storybook/fixtures'
import { ProfileScreen } from './ProfileScreen'

const meta: Meta<typeof ProfileScreen> = {
  title: 'Screens/Mentee/Profile',
  component: ProfileScreen,
  parameters: { layout: 'padded', auth: { user: menteeUser } },
  args: {
    data: {
      name: 'Brian Kamau',
      email: 'brian.kamau@example.com',
      cohortLabel: 'Cohort 11, Mentee',
      ictTrack: 'Cybersecurity',
      hasPeerMentor: true,
    },
    onSignOut: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof ProfileScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Default: Story = {}
export const NewMentee: Story = {
  args: {
    data: {
      name: 'Brian Kamau',
      email: 'brian.kamau@example.com',
      cohortLabel: 'Cohort 11, Mentee',
      ictTrack: null,
      hasPeerMentor: false,
    },
  },
}
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load your profile. Try again.",
    onRetry: () => undefined,
  },
}
