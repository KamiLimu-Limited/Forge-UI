import type { Meta, StoryObj } from '@storybook/react'
import { samplePreview } from '../../../.storybook/graduationFixtures'
import { CorrectionScreen } from './CorrectionScreen'

const graduated = { ...samplePreview, isGraduated: true }
const mentee = { ...samplePreview.nonGraduates[0], graduated: false }

const meta: Meta<typeof CorrectionScreen> = {
  title: 'Screens/ProgramLead/Correction',
  component: CorrectionScreen,
  parameters: { layout: 'padded' },
  args: {
    data: graduated,
    draft: { menteeId: mentee.id, result: 'graduated', reason: '', password: '' },
    onChange: () => undefined,
    selected: mentee,
    errors: {},
    onSave: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof CorrectionScreen>

export const Default: Story = {}
export const MissingReason: Story = {
  args: {
    errors: { reason: 'Give the reason for the correction', password: 'Enter your password' },
  },
}
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load the graduation record. Try again.",
    onRetry: () => undefined,
  },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
