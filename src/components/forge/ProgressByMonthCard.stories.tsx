import type { Meta, StoryObj } from '@storybook/react'
import { sampleMonthProgress } from '../../../.storybook/menteeFixtures'
import { ProgressByMonthCard } from './ProgressByMonthCard'

const meta: Meta<typeof ProgressByMonthCard> = {
  title: 'Forge/ProgressByMonthCard',
  component: ProgressByMonthCard,
  tags: ['autodocs'],
  args: { rows: sampleMonthProgress },
}

export default meta
type Story = StoryObj<typeof ProgressByMonthCard>

// Use the viewport toolbar: a list at 375px, a table at 1280px
export const Default: Story = {}
export const Loading: Story = { args: { rows: [], isLoading: true } }
export const Empty: Story = { args: { rows: [] } }
export const WithError: Story = {
  args: { rows: [], error: "We couldn't load your progress. Try again.", onRetry: () => undefined },
}
