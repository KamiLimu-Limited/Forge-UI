import { pillarClasses } from '@/components/forge/TrackBadge'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { cx } from '@/lib/cx'
import type { Pillar } from '@/lib/labels'

// A decorative preview of the app for the cover page: a month of sessions and a session's
// status. It is drawn from the app's own styles, so it stays sharp at any size. Nothing in
// it can be focused or clicked, and screen readers skip it.

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Sample sessions by day of August 2026. Day 0 and below are the end of July.
const SESSIONS: Record<number, { title: string; pillar: Pillar }> = {
  0: { title: 'Pitch practice', pillar: 'innovation' },
  1: { title: 'Consultations', pillar: 'personal-dev' },
  6: { title: 'Scholarship basics', pillar: 'scholarship' },
  8: { title: 'Session at iHub', pillar: 'ict' },
  13: { title: 'ICT training 6', pillar: 'ict' },
  20: { title: 'Partner review', pillar: 'professional-dev' },
  21: { title: 'Computing meetup', pillar: 'innovation' },
  22: { title: 'User validation', pillar: 'community' },
  27: { title: 'ICT training 7', pillar: 'ict' },
  34: { title: 'Interview skills', pillar: 'professional-dev' },
  36: { title: 'Session at iHub', pillar: 'ict' },
}

// August 2026 starts on a Saturday, so the grid opens on Monday 27 July
const FIRST_DAY = -4
const WEEKS = 6

function dayLabel(day: number): number {
  if (day <= 0) return 31 + day
  if (day > 31) return day - 31
  return day
}

function StatusCard() {
  return (
    <div className="w-96 rounded-lg border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-card-title font-semibold text-text-primary">Status</span>
        <Badge variant="success">Published</Badge>
      </div>
      <dl className="mt-4 flex flex-col gap-2 font-sans text-small">
        {[
          ['Attendance window', 'Closes Fri 28 Aug, 10:00 AM'],
          ['Visible to', 'Cybersecurity track'],
          ['Published by', 'System Admin'],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3">
            <dt className="whitespace-nowrap text-text-secondary">{label}</dt>
            <dd className="whitespace-nowrap text-right text-text-primary">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function MonthCalendar() {
  return (
    <div className="w-calendar-preview overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      <div className="flex items-center gap-3 bg-background px-5 py-4">
        <span className="flex rounded-control border border-border bg-surface p-1 font-sans text-small">
          <span className="px-3 py-1 text-text-secondary">List</span>
          <span className="rounded-md bg-accent-bg px-3 py-1 font-semibold text-accent-text">
            Calendar
          </span>
        </span>
        <span className="flex items-center gap-2 rounded-control border border-border bg-surface px-3 py-2 font-mono text-small font-semibold text-text-primary">
          <Icon name="chevron-left" className="size-4" />
          August 2026
          <Icon name="chevron-right" className="size-4" />
        </span>
        <span className="rounded-control bg-primary px-4 py-2 font-mono text-small font-semibold text-text-on-primary">
          Open session
        </span>
      </div>
      <div className="grid grid-cols-7 border-t border-border">
        {WEEKDAYS.map((day) => (
          <span key={day} className="py-3 text-center font-sans text-small text-text-secondary">
            {day}
          </span>
        ))}
        {Array.from({ length: WEEKS * 7 }, (_, index) => {
          const day = FIRST_DAY + index
          const session = SESSIONS[day]
          const isOutside = day <= 0 || day > 31
          return (
            <div
              key={day}
              className={cx(
                'flex h-24 flex-col gap-1 border-l border-t border-border p-2',
                isOutside && 'bg-background'
              )}
            >
              <span
                className={cx(
                  'font-sans text-small',
                  isOutside ? 'text-text-muted' : 'text-text-primary'
                )}
              >
                {dayLabel(day)}
              </span>
              {session && (
                <span
                  className={cx(
                    'truncate rounded-md px-2 py-1 font-sans text-caption',
                    pillarClasses[session.pillar]
                  )}
                >
                  {session.title}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AppPreview() {
  return (
    <div aria-hidden="true" className="pointer-events-none relative h-full w-full select-none">
      <div className="absolute left-0 top-0 md:top-36">
        <MonthCalendar />
      </div>
      {/* Phones show only the calendar, as the card would cover it */}
      <div className="absolute top-0 hidden md:left-56 md:block">
        <StatusCard />
      </div>
    </div>
  )
}
