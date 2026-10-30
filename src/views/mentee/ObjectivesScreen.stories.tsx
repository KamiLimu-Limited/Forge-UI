import type { Meta, StoryObj } from '@storybook/react'
import { menteeUser } from '../../../.storybook/fixtures'
import { sampleObjectives } from '../../../.storybook/menteeFixtures'
import { ObjectivesScreen } from './ObjectivesScreen'

const meta: Meta<typeof ObjectivesScreen> = {
  title: 'Screens/Mentee/Objectives',
  component: ObjectivesScreen,
  parameters: { layout: 'padded', auth: { user: menteeUser } },
  args: { data: sampleObjectives, onSave: () => undefined },
}

export default meta
type Story = StoryObj<typeof ObjectivesScreen>

// Use the viewport toolbar to check 375px (phone) and 1280px (desktop) against the designs
export const Default: Story = {}
export const NoWindowOpen: Story = {
  args: {
    data: {
      ...sampleObjectives,
      openWindow: null,
      windows: sampleObjectives.windows.map((window) => ({ ...window, isOpen: false })),
    },
  },
}
export const NoObjectives: Story = { args: { data: { ...sampleObjectives, objectives: [] } } }
export const SaveFailed: Story = {
  args: { saveError: "We couldn't save your ratings. Try again." },
}
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load your objectives. Try again.",
    onRetry: () => undefined,
  },
}
