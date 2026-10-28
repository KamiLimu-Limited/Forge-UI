'use client'

import { useState } from 'react'
import { SessionRow } from '@/components/forge/SessionRow'
import { NoCohortNotice } from '@/components/layout/NoCohortNotice'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Select } from '@/components/ui/Select'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import {
  NO_CALENDAR_FILTERS,
  useSessionCalendar,
  type CalendarFilters,
} from '@/hooks/useSessionCalendar'
import { formatDay, parseDateOnly } from '@/lib/format'
import { ALL_PILLARS, CATEGORY_LABELS, PILLAR_LABELS, SESSION_STATUS_LABELS } from '@/lib/labels'
import { monthLabel } from '@/lib/sessions'
import type { MonthBoundary } from '@/types/cohort'
import type { SessionCategory, SessionResponse, SessionStatus } from '@/types/session'

const longDay = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' })

function monthSubtitle(month: number | null, boundary: MonthBoundary | null): string {
  if (month === null) return 'No KamiLimu months set for this cohort yet.'
  const label = monthLabel(month, boundary)
  if (!boundary) return label
  return `${label}: ${longDay.format(parseDateOnly(boundary.start))} to ${longDay.format(parseDateOnly(boundary.end))}`
}

// Past sessions open their attendance; upcoming ones open the editor
function sessionHref(session: SessionResponse, now: Date): string {
  return new Date(session.ends_at) < now
    ? `/admin/sessions/${session.id}/attendance`
    : `/admin/sessions/${session.id}`
}

const CATEGORY_FILTERS = (Object.keys(CATEGORY_LABELS) as SessionCategory[]).map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
}))

const STATUS_FILTERS = (Object.keys(SESSION_STATUS_LABELS) as SessionStatus[]).map((value) => ({
  value,
  label: SESSION_STATUS_LABELS[value],
}))

export function SessionCalendarPage() {
  const { cohort, isLoading: cohortLoading } = useActiveCohort()
  const [filters, setFilters] = useState<CalendarFilters>(NO_CALENDAR_FILTERS)
  const calendar = useSessionCalendar(cohort, filters)
  const now = new Date()

  const index = calendar.month === null ? -1 : calendar.months.indexOf(calendar.month)
  const prev = index > 0 ? calendar.months[index - 1] : null
  const next = index >= 0 && index < calendar.months.length - 1 ? calendar.months[index + 1] : null

  const setFilter = <K extends keyof CalendarFilters>(key: K, value: CalendarFilters[K]) =>
    setFilters((current) => ({ ...current, [key]: value }))

  if (!cohortLoading && !cohort) {
    return (
      <>
        <PageHeader title="Session calendar" />
        <NoCohortNotice />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Session calendar"
        subtitle={
          calendar.isLoading && calendar.month === null
            ? 'Loading'
            : monthSubtitle(calendar.month, calendar.boundary)
        }
        action={
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2" role="group" aria-label="KamiLimu month">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => prev !== null && calendar.setMonth(prev)}
                disabled={prev === null}
                aria-label={prev !== null ? `Previous month, Month ${prev}` : 'No earlier month'}
              >
                {prev !== null ? `Month ${prev}` : 'Earlier'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => next !== null && calendar.setMonth(next)}
                disabled={next === null}
                aria-label={next !== null ? `Next month, Month ${next}` : 'No later month'}
              >
                {next !== null ? `Month ${next}` : 'Later'}
              </Button>
            </div>
            <ButtonLink href="/admin/sessions/new">New session</ButtonLink>
          </div>
        }
      />

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Track">
          <span className="mr-1 font-sans text-small text-text-secondary">Track</span>
          <Chip
            variant={filters.ictOnly ? 'default' : 'on'}
            pressed={!filters.ictOnly}
            onClick={() => setFilter('ictOnly', false)}
          >
            All
          </Chip>
          {ALL_PILLARS.map((pillar) =>
            pillar === 'ict' ? (
              <Chip
                key={pillar}
                variant={filters.ictOnly ? 'on' : 'default'}
                pressed={filters.ictOnly}
                onClick={() => setFilter('ictOnly', true)}
              >
                {PILLAR_LABELS[pillar]}
              </Chip>
            ) : (
              <Chip key={pillar} onClick={() => undefined} disabled>
                {PILLAR_LABELS[pillar]}
              </Chip>
            )
          )}
          <span className="font-sans text-caption text-text-muted">
            Other pillars: not available yet
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:max-w-3xl">
          <Select
            aria-label="Category"
            options={[{ value: '', label: 'All categories' }, ...CATEGORY_FILTERS]}
            value={filters.category}
            onChange={(e) => setFilter('category', e.target.value as SessionCategory | '')}
          />
          <Select
            aria-label="Status"
            options={[{ value: '', label: 'All statuses' }, ...STATUS_FILTERS]}
            value={filters.status}
            onChange={(e) => setFilter('status', e.target.value as SessionStatus | '')}
          />
          <Select
            aria-label="Session type"
            options={[{ value: '', label: 'All types' }]}
            value=""
            onChange={() => undefined}
            disabled
            hint="Session type: not available yet"
          />
        </div>
      </div>

      <Card>
        {calendar.isLoading ? (
          <LoadingState label="Loading sessions" />
        ) : calendar.error ? (
          <ErrorState message={calendar.error} onRetry={calendar.refetch} />
        ) : calendar.days.length === 0 ? (
          <EmptyState
            icon="calendar"
            title="No sessions this month"
            description={
              !filters.ictOnly && !filters.category && !filters.status
                ? 'Sessions you create for this month show up here.'
                : 'No sessions match these filters. Clear them to see the whole month.'
            }
            action={<ButtonLink href="/admin/sessions/new">New session</ButtonLink>}
          />
        ) : (
          <ol className="flex flex-col">
            {calendar.days.map((day) => (
              <li
                key={day.key}
                className="flex flex-col gap-3 border-t border-border py-4 first:border-t-0 first:pt-0 last:pb-0 md:flex-row md:gap-5"
              >
                <div className="flex shrink-0 flex-col md:w-36">
                  <span className="font-mono text-small font-semibold text-text-primary">
                    {formatDay(day.date)}
                  </span>
                  <span className="font-sans text-caption text-text-muted">
                    {CATEGORY_LABELS[day.sessions[0].category]}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  {day.sessions.map((session) => (
                    <SessionRow
                      key={session.id}
                      session={session}
                      href={sessionHref(session, now)}
                      now={now}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </>
  )
}
