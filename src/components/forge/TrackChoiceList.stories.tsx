import type { Meta, StoryObj } from '@storybook/react'
import { TrackChoiceList } from './TrackChoiceList'

const meta: Meta<typeof TrackChoiceList> = {
  title: 'Forge/TrackChoiceList',
  component: TrackChoiceList,
  parameters: { layout: 'padded' },
  args: {
    tracks: [
      {
        name: 'Cloud Engineering',
        description: 'Short track description',
        leadMentorName: 'Achieng Odhiambo',
      },
      { name: 'Data Science', description: null, leadMentorName: null },
    ],
    selected: 'Cloud Engineering',
    onSelect: () => undefined,
  },
}

export default meta
type Story = StoryObj<typeof TrackChoiceList>

export const Default: Story = {}
export const NothingChosen: Story = { args: { selected: null } }
export const Disabled: Story = { args: { disabled: true } }
