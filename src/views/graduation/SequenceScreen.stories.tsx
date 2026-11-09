import type { Meta, StoryObj } from '@storybook/react'
import { sampleSequence } from '../../../.storybook/graduationFixtures'
import { SequenceScreen } from './SequenceScreen'

const meta: Meta<typeof SequenceScreen> = {
  title: 'Screens/Graduation/Sequence',
  component: SequenceScreen,
  parameters: { layout: 'fullscreen' },
  args: {
    data: sampleSequence,
    step: { kind: 'opening' },
    index: 0,
    count: sampleSequence.graduates.length + 4,
    isPlaying: true,
    reducedMotion: false,
    isFullscreen: false,
    onNext: () => undefined,
    onPrevious: () => undefined,
    onTogglePlay: () => undefined,
    onReplay: () => undefined,
    onToggleFullscreen: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof SequenceScreen>

export const Opening: Story = {}
export const Numbers: Story = { args: { step: { kind: 'numbers' }, index: 1, reducedMotion: true } }
export const Reveal: Story = { args: { step: { kind: 'reveal', index: 0 }, index: 2 } }
export const Mentors: Story = { args: { step: { kind: 'mentors' }, index: 10 } }
export const Closing: Story = { args: { step: { kind: 'closing' }, index: 11 } }
export const Paused: Story = { args: { ...Reveal.args, isPlaying: false } }
export const NoGraduatesYet: Story = {
  args: { data: { ...sampleSequence, graduates: [] }, step: { kind: 'mentors' }, index: 2 },
}
export const Loading: Story = { args: { data: null, step: null, isLoading: true } }
export const WithError: Story = {
  args: {
    data: null,
    step: null,
    error: "We couldn't load the graduation sequence. Try again.",
    onRetry: () => undefined,
  },
}
