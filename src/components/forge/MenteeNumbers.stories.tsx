import type { Meta, StoryObj } from '@storybook/react'
import { sampleGroup } from '../../../.storybook/peerMentorFixtures'
import { MenteeNumbers } from './MenteeNumbers'

const meta: Meta<typeof MenteeNumbers> = {
  title: 'Forge/MenteeNumbers',
  component: MenteeNumbers,
  tags: ['autodocs'],
  args: { mentee: sampleGroup[0] },
}

export default meta
type Story = StoryObj<typeof MenteeNumbers>

export const Default: Story = {}
