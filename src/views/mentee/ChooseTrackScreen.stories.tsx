import type { Meta, StoryObj } from '@storybook/react'
import type { ChooseTrackView } from '@/types/ictTrackSelection'
import { ChooseTrackScreen } from './ChooseTrackScreen'

const tracks: ChooseTrackView['tracks'] = [
  { name: 'Cloud Engineering', description: null, leadMentorName: null },
  { name: 'Software Engineering', description: null, leadMentorName: null },
  { name: 'Data Science', description: null, leadMentorName: null },
  { name: 'Cybersecurity', description: null, leadMentorName: null },
]

const meta: Meta<typeof ChooseTrackScreen> = {
  title: 'Screens/Mentee/ChooseTrack',
  component: ChooseTrackScreen,
  parameters: { layout: 'padded' },
  args: {
    data: { tracks, currentTrack: null, closesOn: null },
    selected: null,
    onSelect: () => undefined,
    canSave: false,
  },
}

export default meta
type Story = StoryObj<typeof ChooseTrackScreen>

// What ships today: the tracks show, choosing and saving wait for the API (gap M4)
export const NotAvailableYet: Story = {}
export const CurrentTrack: Story = {
  args: {
    data: { tracks, currentTrack: 'Software Engineering', closesOn: null },
    selected: 'Software Engineering',
  },
}
// How the screen works once the API has track selection
export const WindowOpen: Story = {
  args: {
    data: {
      tracks: tracks.map((track, index) => ({
        ...track,
        description: 'Short track description',
        leadMentorName: ['Achieng Odhiambo', 'Kevin Mwangi', 'Lucy Wairimu', 'Daniel Kiptoo'][
          index
        ],
      })),
      currentTrack: null,
      closesOn: '2026-05-15',
    },
    selected: 'Cybersecurity',
    canSave: true,
  },
}
export const NoTracks: Story = {
  args: { data: { tracks: [], currentTrack: null, closesOn: null } },
}
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load the ICT tracks. Try again.",
    onRetry: () => undefined,
  },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
