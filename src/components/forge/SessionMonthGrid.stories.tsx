import type { Meta, StoryObj } from '@storybook/react'
import { buildMonthGrid } from '@/lib/monthGrid'
import type { MonthBoundary } from '@/types/cohort'
import type { SessionResponse } from '@/types/session'
import { sampleSession } from '../../../.storybook/fixtures'
import { SessionMonthGrid } from './SessionMonthGrid'

const boundary: MonthBoundary = { month: 5, start: '2026-08-06', end: '2026-09-02' }
const now = new Date('2026-08-20T09:00:00Z')

function session(
  id: string,
  startsAt: string,
  title: string,
  overrides: Partial<SessionResponse> = {}
): SessionResponse {
  const start = new Date(startsAt)
  return {
    ...sampleSession,
    id,
    title,
    starts_at: start.toISOString(),
    ends_at: new Date(start.getTime() + 150 * 60_000).toISOString(),
    ...overrides,
  }
}

const month: SessionResponse[] = [
  session('a', '2026-08-06T14:30:00Z', 'Opening the month', { session_type: 'core', track: null }),
  session('b', '2026-08-08T07:00:00Z', 'Cybersecurity: ICT Training 7', { category: 'saturday' }),
  session('c', '2026-08-13T14:30:00Z', 'Personal branding', { session_type: 'core', track: null }),
  session('d', '2026-08-15T07:00:00Z', 'Career talk with a mentor', {
    session_type: 'professional',
    category: 'saturday',
    track: null,
  }),
  session('e', '2026-08-20T14:30:00Z', 'Scholarship essays', { session_type: 'core', track: null }),
  session('f', '2026-08-22T07:00:00Z', 'Data science: ICT Training 8', {
    category: 'saturday',
    track: 'Data science',
    status: 'draft',
  }),
  session('g', '2026-08-27T14:30:00Z', 'Community project check-in', {
    session_type: 'core',
    track: null,
    status: 'cancelled',
  }),
  session('h', '2026-08-29T07:00:00Z', 'Peer mentorship session 3', {
    session_type: 'peer_mentorship',
    category: 'peer_mentorship',
    track: null,
  }),
]

const busyDay: SessionResponse[] = [
  ...month,
  ...['Web: ICT Training 8', 'Mobile: ICT Training 8', 'Cloud: ICT Training 8'].map((title, i) =>
    session(`busy-${i}`, `2026-08-22T${String(8 + i).padStart(2, '0')}:00:00Z`, title, {
      category: 'saturday',
    })
  ),
]

const meta: Meta<typeof SessionMonthGrid> = {
  title: 'Forge/SessionMonthGrid',
  component: SessionMonthGrid,
  parameters: { layout: 'padded' },
  args: {
    weeks: buildMonthGrid(boundary, month, now),
    hrefFor: (s: SessionResponse) => `/admin/sessions/${s.id}`,
    now,
  },
}

export default meta
type Story = StoryObj<typeof SessionMonthGrid>

export const Default: Story = {}
export const BusyDay: Story = { args: { weeks: buildMonthGrid(boundary, busyDay, now) } }
export const NoSessions: Story = { args: { weeks: buildMonthGrid(boundary, [], now) } }
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
