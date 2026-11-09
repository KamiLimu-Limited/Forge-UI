import type { Meta, StoryObj } from '@storybook/react'
import { sampleSessions } from '../../../.storybook/menteeFixtures'
import { MenteeSessionRow } from './MenteeSessionRow'

const meta: Meta<typeof MenteeSessionRow> = {
  title: 'Forge/MenteeSessionRow',
  component: MenteeSessionRow,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MenteeSessionRow>

// Use the viewport toolbar: a card at 375px, a row at 1280px
export const Open: Story = { args: { kind: 'open', session: sampleSessions.open[0] } }
export const OpensToday: Story = { args: { kind: 'upcoming', session: sampleSessions.upcoming[0] } }
export const OpensLater: Story = { args: { kind: 'upcoming', session: sampleSessions.upcoming[1] } }
