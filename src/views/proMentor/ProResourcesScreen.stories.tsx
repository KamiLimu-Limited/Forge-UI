import type { Meta, StoryObj } from '@storybook/react'
import { sampleProSessions } from '../../../.storybook/proMentorFixtures'
import { ProResourcesScreen } from './ProResourcesScreen'

const meta: Meta<typeof ProResourcesScreen> = {
  title: 'Screens/ProMentor/Resources',
  component: ProResourcesScreen,
  parameters: { layout: 'padded' },
  args: {
    data: sampleProSessions,
    linkFor: (row) => row.materialsUrl ?? '',
    onLinkChange: () => undefined,
    onSave: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof ProResourcesScreen>

export const Default: Story = {}
export const Saving: Story = {
  args: { savingId: 's-2', linkFor: () => 'https://drive.google.com/x' },
}
export const BadLink: Story = {
  args: {
    linkFor: (row) => (row.id === 's-2' ? 'drive folder' : (row.materialsUrl ?? '')),
    fieldErrors: { 's-2': 'Paste a full link, starting https://' },
  },
}
export const NoSessions: Story = {
  args: { data: { cohortName: 'Cohort 11', upcoming: [], past: [] } },
}
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load your sessions. Try again.",
    onRetry: () => undefined,
  },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
