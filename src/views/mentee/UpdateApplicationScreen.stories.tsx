import type { Meta, StoryObj } from '@storybook/react'
import { menteeUser } from '../../../.storybook/fixtures'
import { sampleApplication } from '../../../.storybook/menteeFixtures'
import { UpdateApplicationScreen } from './UpdateApplicationScreen'

const meta: Meta<typeof UpdateApplicationScreen> = {
  title: 'Screens/Mentee/UpdateApplication',
  component: UpdateApplicationScreen,
  parameters: { layout: 'padded', auth: { user: menteeUser } },
  args: {
    application: sampleApplication,
    stage: 'technical_interview',
    onStageChange: () => undefined,
    finalOutcome: 'waiting_for_response',
    onFinalOutcomeChange: () => undefined,
    onSave: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof UpdateApplicationScreen>

export const Default: Story = {}
export const AlreadyReviewed: Story = {
  args: { application: { ...sampleApplication, canUpdate: false } },
}
export const SaveFailed: Story = {
  args: { saveError: "We couldn't save your changes. Try again." },
}
export const Loading: Story = { args: { application: null, isLoading: true } }
export const WithError: Story = {
  args: {
    application: null,
    error: "We couldn't load this application. Try again.",
    onRetry: () => undefined,
  },
}
