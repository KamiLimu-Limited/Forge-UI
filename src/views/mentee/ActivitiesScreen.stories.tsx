import type { Meta, StoryObj } from '@storybook/react'
import { PEER_MENTOR_SAVE_NOTE } from '@/lib/participation'
import { menteeUser } from '../../../.storybook/fixtures'
import { sampleActivities } from '../../../.storybook/menteeFixtures'
import { ActivitiesScreen } from './ActivitiesScreen'

const meta: Meta<typeof ActivitiesScreen> = {
  title: 'Screens/Mentee/Activities',
  component: ActivitiesScreen,
  parameters: {
    layout: 'padded',
    auth: { user: menteeUser },
    nextjs: { appDirectory: true, navigation: { pathname: '/dashboard/activities' } },
  },
  args: { data: sampleActivities },
}

export default meta
type Story = StoryObj<typeof ActivitiesScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Default: Story = {}
export const NothingLogged: Story = {
  args: {
    data: {
      totalPoints: 0,
      loggedCount: 0,
      tiles: sampleActivities.tiles.map((tile) => ({ ...tile, count: 0, points: 0 })),
      recent: [],
    },
  },
}
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load your activities. Try again.",
    onRetry: () => undefined,
  },
}
// A 1:1 peer mentor using the same screen: everything shows, saving is switched off
export const AsPeerMentor: Story = { args: { saveBlockedNote: PEER_MENTOR_SAVE_NOTE } }
