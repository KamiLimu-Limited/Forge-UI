import type { Meta, StoryObj } from '@storybook/react'
import { RatingBar } from './RatingBar'

const meta: Meta<typeof RatingBar> = {
  title: 'Forge/RatingBar',
  component: RatingBar,
  tags: ['autodocs'],
  args: { label: 'Quality of the session', average: 4.5 },
}

export default meta
type Story = StoryObj<typeof RatingBar>

export const Rated: Story = {}
export const NoAnswersYet: Story = { args: { average: null } }
