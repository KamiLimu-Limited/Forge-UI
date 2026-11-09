import type { Meta, StoryObj } from '@storybook/react'
import { sampleObjectives } from '../../../.storybook/menteeFixtures'
import { ObjectiveRatingRow } from './ObjectiveRatingRow'

const meta: Meta<typeof ObjectiveRatingRow> = {
  title: 'Forge/ObjectiveRatingRow',
  component: ObjectiveRatingRow,
  tags: ['autodocs'],
  args: {
    objective: sampleObjectives.objectives[0],
    windows: sampleObjectives.windows,
    value: 4,
    onChange: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof ObjectiveRatingRow>

// Use the viewport toolbar: tiles at 375px, columns at 1280px
export const Default: Story = {}
export const NotRatedYet: Story = { args: { value: undefined } }
export const WithError: Story = { args: { value: undefined, error: 'Choose a rating' } }
export const NoWindowOpen: Story = {
  args: {
    windows: sampleObjectives.windows.map((window) => ({ ...window, isOpen: false })),
  },
}
