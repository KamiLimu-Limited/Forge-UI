import type { Meta, StoryObj } from '@storybook/react'
import { sampleTrack } from '../../../.storybook/ictPeerMentorFixtures'
import { MyTrackScreen } from './MyTrackScreen'

const meta: Meta<typeof MyTrackScreen> = {
  title: 'Screens/IctPeerMentor/MyTrack',
  component: MyTrackScreen,
  parameters: { layout: 'padded', nextjs: { navigation: { pathname: '/dashboard' } } },
  args: { data: sampleTrack },
}

export default meta
type Story = StoryObj<typeof MyTrackScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Default: Story = {}
export const NoTrackYet: Story = { args: { data: null } }
export const NoMenteesYet: Story = {
  args: { data: { ...sampleTrack, menteeCount: 0, attendanceRate: null, mentees: [] } },
}
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: { data: null, error: "We couldn't load your track. Try again.", onRetry: () => undefined },
}
