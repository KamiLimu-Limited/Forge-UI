import type { Meta, StoryObj } from '@storybook/react'
import { sampleTrackProgress } from '../../../.storybook/menteeFixtures'
import { ProgressByTrackCard } from './ProgressByTrackCard'

const meta: Meta<typeof ProgressByTrackCard> = {
  title: 'Forge/ProgressByTrackCard',
  component: ProgressByTrackCard,
  tags: ['autodocs'],
  args: { rows: sampleTrackProgress },
}

export default meta
type Story = StoryObj<typeof ProgressByTrackCard>

// Use the viewport toolbar: a list with bars at 375px, a table at 1280px
export const Default: Story = {}
export const Loading: Story = { args: { rows: [], isLoading: true } }
export const Empty: Story = { args: { rows: [] } }
export const WithError: Story = {
  args: { rows: [], error: "We couldn't load your progress. Try again.", onRetry: () => undefined },
}
