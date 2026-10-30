import type { Meta, StoryObj } from '@storybook/react'
import { sampleHistory } from '../../../.storybook/menteeFixtures'
import { SessionHistoryDetail } from './SessionHistoryDetail'

const meta: Meta<typeof SessionHistoryDetail> = {
  title: 'Forge/SessionHistoryDetail',
  component: SessionHistoryDetail,
  tags: ['autodocs'],
  args: { row: sampleHistory[0] },
}

export default meta
type Story = StoryObj<typeof SessionHistoryDetail>

export const Submitted: Story = {}
export const NothingSubmitted: Story = { args: { row: sampleHistory[2] } }
// Session details couldn't be loaded, so there is no end time
export const WithoutEndTime: Story = { args: { row: sampleHistory[3] } }
