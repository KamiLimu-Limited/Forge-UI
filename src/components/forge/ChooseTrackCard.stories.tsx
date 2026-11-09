import type { Meta, StoryObj } from '@storybook/react'
import { ChooseTrackCard } from './ChooseTrackCard'

const meta: Meta<typeof ChooseTrackCard> = {
  title: 'Forge/ChooseTrackCard',
  component: ChooseTrackCard,
  tags: ['autodocs'],
  args: { closesOn: '2026-03-20' },
}

export default meta
type Story = StoryObj<typeof ChooseTrackCard>

// Use the viewport toolbar: a full-width button at 375px, beside the text at 1280px
export const Default: Story = {}
