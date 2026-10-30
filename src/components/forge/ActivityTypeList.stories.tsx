import type { Meta, StoryObj } from '@storybook/react'
import { sampleActivities } from '../../../.storybook/menteeFixtures'
import { ActivityTypeList } from './ActivityTypeList'

const meta: Meta<typeof ActivityTypeList> = {
  title: 'Forge/ActivityTypeList',
  component: ActivityTypeList,
  tags: ['autodocs'],
  args: { tiles: sampleActivities.tiles },
}

export default meta
type Story = StoryObj<typeof ActivityTypeList>

// Use the viewport toolbar: rows at 375px, cards at 1280px
export const Default: Story = {}
export const NothingLogged: Story = {
  args: { tiles: sampleActivities.tiles.map((tile) => ({ ...tile, count: 0, points: 0 })) },
}
