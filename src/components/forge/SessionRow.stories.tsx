import type { Meta, StoryObj } from '@storybook/react'
import { sampleSession } from '../../../.storybook/fixtures'
import { SessionRow } from './SessionRow'

const meta: Meta<typeof SessionRow> = {
  title: 'Forge/SessionRow',
  component: SessionRow,
  tags: ['autodocs'],
  args: {
    session: sampleSession,
    href: '/admin/sessions/s-1',
    now: new Date('2026-08-20T09:00:00Z'),
  },
}

export default meta
type Story = StoryObj<typeof SessionRow>

export const Published: Story = {}
export const Live: Story = { args: { now: new Date('2026-08-27T15:00:00Z') } }
export const Draft: Story = {
  args: {
    session: {
      ...sampleSession,
      status: 'draft',
      title: 'Innovation Solution Ideation',
      session_type: 'core',
      track: null,
    },
  },
}
export const InPerson: Story = {
  args: {
    session: {
      ...sampleSession,
      title: 'KamiLimu In-Person Sessions',
      session_type: 'core',
      track: null,
      mode: 'physical',
      location: 'Nairobi Garage',
      category: 'saturday',
    },
  },
}
export const Cancelled: Story = { args: { session: { ...sampleSession, status: 'cancelled' } } }
