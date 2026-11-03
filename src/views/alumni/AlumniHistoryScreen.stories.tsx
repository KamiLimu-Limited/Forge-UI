import type { Meta, StoryObj } from '@storybook/react'
import { sampleAlumniRecord } from '../../../.storybook/alumniFixtures'
import { AlumniHistoryScreen } from './AlumniHistoryScreen'

const meta: Meta<typeof AlumniHistoryScreen> = {
  title: 'Screens/Alumni/History',
  component: AlumniHistoryScreen,
  parameters: { layout: 'padded' },
  args: { data: sampleAlumniRecord, tab: 'sessions', onTabChange: () => undefined },
}

export default meta
type Story = StoryObj<typeof AlumniHistoryScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Sessions: Story = {}
export const Activities: Story = { args: { tab: 'activities' } }
export const Objectives: Story = { args: { tab: 'objectives' } }
export const PartsRefused: Story = {
  args: { data: { ...sampleAlumniRecord, sessions: null, activities: null, objectives: null } },
}
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load your record. Try again.",
    onRetry: () => undefined,
  },
}
