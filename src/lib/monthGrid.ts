import { parseDateOnly } from '@/lib/format'
import type { MonthBoundary } from '@/types/cohort'
import type { MonthGridDay, SessionResponse } from '@/types/session'

function isoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d)
  next.setDate(d.getDate() + days)
  return next
}

function mondayOf(d: Date): Date {
  const monday = new Date(d)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  return monday
}

// Whole Monday-to-Sunday weeks covering a KamiLimu month. KamiLimu months are the cohort's
// own date ranges, not calendar months, so the grid follows the boundary. The range also
// stretches to any session dated outside it, so a misfiled session still shows up.
export function buildMonthGrid(
  boundary: MonthBoundary | null,
  sessions: SessionResponse[],
  now: Date = new Date()
): MonthGridDay[][] {
  const byDay = new Map<string, SessionResponse[]>()
  for (const session of [...sessions].sort((a, b) => a.starts_at.localeCompare(b.starts_at))) {
    const key = isoDay(new Date(session.starts_at))
    byDay.set(key, [...(byDay.get(key) ?? []), session])
  }

  const keys = [...byDay.keys()].sort()
  const start = boundary?.start.slice(0, 10)
  const end = boundary?.end.slice(0, 10)
  const bounds = [start, end, keys[0], keys[keys.length - 1]]
    .filter((key): key is string => Boolean(key))
    .sort()
  if (bounds.length === 0) return []

  const last = parseDateOnly(bounds[bounds.length - 1])
  const todayKey = isoDay(now)
  const weeks: MonthGridDay[][] = []
  for (
    let monday = mondayOf(parseDateOnly(bounds[0]));
    monday <= last;
    monday = addDays(monday, 7)
  ) {
    weeks.push(
      Array.from({ length: 7 }, (_, offset) => {
        const date = addDays(monday, offset)
        const key = isoDay(date)
        return {
          key,
          date,
          inMonth: start && end ? start <= key && key <= end : true,
          isToday: key === todayKey,
          sessions: byDay.get(key) ?? [],
        }
      })
    )
  }
  return weeks
}
