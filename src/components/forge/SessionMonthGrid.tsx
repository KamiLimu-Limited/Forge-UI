'use client'

import Link from 'next/link'
import { useState } from 'react'
import { cx } from '@/lib/cx'
import { formatDay, formatTime, plural } from '@/lib/format'
import type { MonthGridDay, SessionResponse, SessionType } from '@/types/session'
import { SessionRow } from './SessionRow'

interface SessionMonthGridProps {
  weeks: MonthGridDay[][]
  hrefFor: (session: SessionResponse) => string
  now?: Date
}

const WEEKDAYS = [
  { short: 'M', name: 'Mon' },
  { short: 'T', name: 'Tue' },
  { short: 'W', name: 'Wed' },
  { short: 'T', name: 'Thu' },
  { short: 'F', name: 'Fri' },
  { short: 'S', name: 'Sat' },
  { short: 'S', name: 'Sun' },
]

// The most entries a desktop cell shows before "N more"
const VISIBLE_PER_DAY = 3

const TYPE_BAR: Record<SessionType, string> = {
  core: 'border-teal-500',
  ict: 'border-info-text',
  professional: 'border-text-muted',
  peer_mentorship: 'border-text-muted',
}

const TYPE_DOT: Record<SessionType, string> = {
  core: 'bg-teal-500',
  ict: 'bg-info-text',
  professional: 'bg-text-muted',
  peer_mentorship: 'bg-text-muted',
}

const LEGEND = [
  { dot: 'bg-teal-500', label: 'Core' },
  { dot: 'bg-info-text', label: 'ICT' },
  { dot: 'bg-text-muted', label: 'Professional and peer mentorship' },
]

function firstSelected(weeks: MonthGridDay[][]): string | null {
  const days = weeks.flat()
  return (
    days.find((day) => day.isToday)?.key ??
    days.find((day) => day.sessions.length > 0)?.key ??
    days.find((day) => day.inMonth)?.key ??
    null
  )
}

function dayLabel(day: MonthGridDay): string {
  return `${formatDay(day.date)}, ${day.sessions.length === 0 ? 'no sessions' : plural(day.sessions.length, 'session')}`
}

function DayNumber({ day }: { day: MonthGridDay }) {
  return (
    <span
      className={cx(
        'inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 font-mono text-caption font-semibold tabular-nums',
        day.isToday
          ? 'bg-teal-500 text-text-on-primary'
          : day.inMonth
            ? 'text-text-primary'
            : 'text-text-muted'
      )}
    >
      {day.date.getDate()}
    </span>
  )
}

// A KamiLimu month as a Monday-to-Sunday grid. From md up each day lists its sessions; on
// phones each day shows a dot per session. Picking a day lists its sessions underneath.
// Remount with a new `key` when the month changes so the picked day resets.
export function SessionMonthGrid({ weeks, hrefFor, now = new Date() }: SessionMonthGridProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(() => firstSelected(weeks))
  const selected = weeks.flat().find((day) => day.key === selectedKey) ?? null

  return (
    <div className="flex flex-col gap-4">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            {WEEKDAYS.map((weekday) => (
              <th
                key={weekday.name}
                scope="col"
                className="pb-2 text-center font-sans text-caption font-medium text-text-secondary md:text-left md:pl-2"
              >
                <abbr title={weekday.name} className="no-underline md:hidden">
                  {weekday.short}
                </abbr>
                <span className="hidden md:inline">{weekday.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0].key}>
              {week.map((day) => {
                const isSelected = day.key === selectedKey
                const hidden = day.sessions.length - VISIBLE_PER_DAY
                return (
                  <td
                    key={day.key}
                    className={cx(
                      'border border-border p-0 align-top md:h-28',
                      isSelected ? 'bg-accent-bg' : day.inMonth ? 'bg-surface' : 'bg-background'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedKey(day.key)}
                      aria-pressed={isSelected}
                      aria-label={dayLabel(day)}
                      className="flex h-full min-h-control w-full flex-col items-center justify-center gap-1 py-1 md:hidden"
                    >
                      <DayNumber day={day} />
                      <span className="flex h-1.5 gap-0.5" aria-hidden="true">
                        {day.sessions.slice(0, VISIBLE_PER_DAY).map((session) => (
                          <span
                            key={session.id}
                            className={cx(
                              'h-1.5 w-1.5 rounded-full',
                              TYPE_DOT[session.session_type],
                              session.status === 'cancelled' && 'opacity-40'
                            )}
                          />
                        ))}
                      </span>
                    </button>

                    <div className="hidden h-full min-w-0 flex-col gap-1 p-1.5 md:flex">
                      <button
                        type="button"
                        onClick={() => setSelectedKey(day.key)}
                        aria-pressed={isSelected}
                        aria-label={dayLabel(day)}
                        className="self-start rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-500"
                      >
                        <DayNumber day={day} />
                      </button>
                      {day.sessions.slice(0, VISIBLE_PER_DAY).map((session) => (
                        <Link
                          key={session.id}
                          href={hrefFor(session)}
                          title={session.title}
                          className={cx(
                            'block truncate rounded-sm border-l-2 bg-background px-1.5 py-0.5 font-sans text-caption hover:text-link',
                            TYPE_BAR[session.session_type],
                            session.status === 'draft' && 'border-dashed text-text-secondary',
                            session.status === 'cancelled'
                              ? 'text-text-muted line-through'
                              : 'text-text-primary'
                          )}
                        >
                          <span className="font-mono tabular-nums">
                            {formatTime(session.starts_at)}
                          </span>{' '}
                          {session.status === 'draft' ? `Draft: ${session.title}` : session.title}
                        </Link>
                      ))}
                      {hidden > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedKey(day.key)}
                          className="self-start font-sans text-caption text-link hover:underline"
                        >
                          {hidden} more
                        </button>
                      )}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Session types">
        {LEGEND.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-1.5 font-sans text-caption text-text-secondary"
          >
            <span className={cx('h-2 w-2 rounded-full', item.dot)} aria-hidden="true" />
            {item.label}
          </li>
        ))}
      </ul>

      {selected && (
        <section aria-live="polite" className="flex flex-col gap-2 border-t border-border pt-4">
          <h2 className="font-mono text-card-title font-semibold text-text-primary">
            {formatDay(selected.date)}
          </h2>
          {selected.sessions.length === 0 ? (
            <p className="font-sans text-small text-text-muted">No sessions</p>
          ) : (
            selected.sessions.map((session) => (
              <SessionRow key={session.id} session={session} href={hrefFor(session)} now={now} />
            ))
          )}
        </section>
      )}
    </div>
  )
}
