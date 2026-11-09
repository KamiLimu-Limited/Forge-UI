import type { Meta, StoryObj } from '@storybook/react'
import { samplePreview } from '../../../.storybook/graduationFixtures'
import { RevealOrderScreen } from './RevealOrderScreen'

const alphabetical = [...samplePreview.graduates].sort((a, b) => a.name.localeCompare(b.name))

const meta: Meta<typeof RevealOrderScreen> = {
  title: 'Screens/ProgramLead/RevealOrder',
  component: RevealOrderScreen,
  parameters: { layout: 'padded' },
  args: {
    data: samplePreview,
    mode: 'alphabetical',
    onModeChange: () => undefined,
    order: alphabetical,
    onMove: () => undefined,
    onRehearse: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof RevealOrderScreen>

export const Alphabetical: Story = {}
export const Custom: Story = { args: { mode: 'custom', order: [...alphabetical].reverse() } }
export const NoGraduates: Story = { args: { order: [] } }
export const Loading: Story = { args: { data: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    error: "We couldn't load the graduates. Try again.",
    onRetry: () => undefined,
  },
}
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
