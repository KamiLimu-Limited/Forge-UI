import type { Meta, StoryObj } from '@storybook/react'
import { sampleActivities } from '../../../.storybook/menteeFixtures'
import { RecentActivityList } from './RecentActivityList'

const meta: Meta<typeof RecentActivityList> = {
  title: 'Forge/RecentActivityList',
  component: RecentActivityList,
  tags: ['autodocs'],
  args: { rows: sampleActivities.recent },
}

export default meta
type Story = StoryObj<typeof RecentActivityList>

// Use the viewport toolbar: a list at 375px, a table at 1280px
export const Default: Story = {}
export const Empty: Story = { args: { rows: [] } }
