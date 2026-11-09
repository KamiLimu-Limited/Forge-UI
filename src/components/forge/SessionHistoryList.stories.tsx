import type { Meta, StoryObj } from '@storybook/react'
import { sampleHistory } from '../../../.storybook/menteeFixtures'
import { SessionHistoryList } from './SessionHistoryList'

const meta: Meta<typeof SessionHistoryList> = {
  title: 'Forge/SessionHistoryList',
  component: SessionHistoryList,
  tags: ['autodocs'],
  args: { rows: sampleHistory, selectedId: sampleHistory[0].sessionId, onSelect: () => undefined },
}

export default meta
type Story = StoryObj<typeof SessionHistoryList>

// Use the viewport toolbar: a list that opens in place at 375px, a table at 1280px
export const Default: Story = {}
export const NothingSelected: Story = { args: { selectedId: null } }
