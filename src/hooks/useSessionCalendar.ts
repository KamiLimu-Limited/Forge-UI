'use client'

import { useEffect, useMemo, useState } from 'react'
import { api, fetchAllPages } from '@/lib/api'
import { monthBoundaries, monthForDate } from '@/lib/sessions'
import type { CohortResponse, MonthBoundary } from '@/types/cohort'
import type { SessionCategory, SessionResponse, SessionStatus } from '@/types/session'
import { useApiQuery } from './useApiQuery'

export interface CalendarFilters {
  ictOnly: boolean
  category: SessionCategory | ''
  status: SessionStatus | ''
}

export const NO_CALENDAR_FILTERS: CalendarFilters = { ictOnly: false, category: '', status: '' }

export interface CalendarDay {
  key: string
  date: Date
  sessions: SessionResponse[]
}

interface UseSessionCalendarReturn {
  months: number[]
  month: number | null
  setMonth: (month: number) => void
  boundary: MonthBoundary | null
  days: CalendarDay[]
  sessionCount: number
  isLoading: boolean
  error: string | null
  refetch: () => void
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

// Sessions grouped by day, earliest first
export function groupByDay(sessions: SessionResponse[]): CalendarDay[] {
  const map = new Map<string, CalendarDay>()
  for (const session of [...sessions].sort((a, b) => a.starts_at.localeCompare(b.starts_at))) {
    const date = new Date(session.starts_at)
    const key = dayKey(date)
    const day = map.get(key) ?? { key, date, sessions: [] }
    day.sessions.push(session)
    map.set(key, day)
  }
  return Array.from(map.values())
}

// One KamiLimu month of a cohort's sessions. Uses GET /cohorts/{id}/calendar for the
// month list, GET /cohorts/{id}/calendar/{month} for a month, and GET /sessions when
// filters are set.
export function useSessionCalendar(
  cohort: CohortResponse | null,
  filters: CalendarFilters
): UseSessionCalendarReturn {
  const cohortId = cohort?.id ?? null
  const [month, setMonth] = useState<number | null>(null)

  const calendar = useApiQuery(() => api.cohorts.calendar(cohortId as string), [cohortId], {
    enabled: cohortId !== null,
    fallbackError: "We couldn't load the calendar.",
  })

  const months = useMemo(() => {
    const set = new Set<number>(monthBoundaries(cohort).map((b) => b.month))
    for (const m of calendar.data ?? []) set.add(m.month)
    return Array.from(set).sort((a, b) => a - b)
  }, [cohort, calendar.data])

  // Start on the month that contains today, or the first month with an upcoming session
  useEffect(() => {
    setMonth(null)
  }, [cohortId])
  useEffect(() => {
    if (month !== null || months.length === 0 || !calendar.data) return
    const now = new Date()
    const current = monthForDate(cohort, now)
    const upcoming = calendar.data.find((m) => m.sessions.some((s) => new Date(s.starts_at) >= now))
    setMonth(current ?? upcoming?.month ?? months[0])
  }, [month, months, cohort, calendar.data])

  const hasFilters = filters.ictOnly || filters.category !== '' || filters.status !== ''

  const monthQuery = useApiQuery<SessionResponse[]>(
    async () => {
      if (!hasFilters) {
        const result = await api.cohorts.calendarMonth(cohortId as string, month as number)
        return result.flatMap((m) => m.sessions)
      }
      return fetchAllPages((page, page_size) =>
        api.sessions.list({
          page,
          page_size,
          cohort_id: cohortId as string,
          kami_limu_month: month as number,
          session_type: filters.ictOnly ? 'ict' : undefined,
          category: filters.category || undefined,
          status: filters.status || undefined,
        })
      )
    },
    [cohortId, month, hasFilters, filters.ictOnly, filters.category, filters.status],
    {
      enabled: cohortId !== null && month !== null,
      fallbackError: "We couldn't load the sessions.",
    }
  )

  const sessions = monthQuery.data ?? []
  const boundary = monthBoundaries(cohort).find((b) => b.month === month) ?? null

  return {
    months,
    month,
    setMonth,
    boundary,
    days: groupByDay(sessions),
    sessionCount: sessions.length,
    isLoading: calendar.isLoading || (month === null && !calendar.error) || monthQuery.isLoading,
    error: calendar.error ?? monthQuery.error,
    refetch: () => {
      calendar.refetch()
      monthQuery.refetch()
    },
  }
}
