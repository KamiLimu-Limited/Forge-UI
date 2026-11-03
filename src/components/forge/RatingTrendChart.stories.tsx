import type { Meta, StoryObj } from '@storybook/react'
import { sampleFacilitator } from '../../../.storybook/peerMentorFixtures'
import { RatingTrendChart } from './RatingTrendChart'

const meta: Meta<typeof RatingTrendChart> = {
  title: 'Forge/RatingTrendChart',
  component: RatingTrendChart,
  tags: ['autodocs'],
  args: { points: sampleFacilitator.trend },
}

export default meta
type Story = StoryObj<typeof RatingTrendChart>

export const FourSessions: Story = {}
export const OneSession: Story = { args: { points: sampleFacilitator.trend.slice(0, 1) } }
export const NoneYet: Story = { args: { points: [] } }
