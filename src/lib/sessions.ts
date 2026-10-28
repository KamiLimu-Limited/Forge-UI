// =============================================================================
// Session helpers shared by the calendar, the session form and the overview
// =============================================================================

import type { Pillar } from '@/lib/labels'
import type { CohortResponse, MonthBoundary } from '@/types/cohort'
import type { SessionBrief, SessionResponse } from '@/types/session'

// The API only stores a pillar for ICT sessions (track holds the ICT track name).
// Other pillars have no field yet, so they get no badge. See docs/api-gaps.md.
export function sessionPillar(session: SessionResponse | SessionBrief): Pillar | null {
  return session.session_type === 'ict' || session.track ? 'ict' : null
}

// Months sorted by number, or an empty list when the cohort has no boundaries
export function monthBoundaries(cohort: CohortResponse | null): MonthBoundary[] {
  return [...(cohort?.kami_limu_month_boundaries ?? [])].sort((a, b) => a.month - b.month)
}

// "Month 5" or the boundary's own name, such as "Month 4 Break"
export function monthLabel(month: number, boundary?: MonthBoundary | null): string {
  return boundary?.name?.trim() || `Month ${month}`
}

// The KamiLimu month that contains `date`, using the cohort's boundaries
export function monthForDate(cohort: CohortResponse | null, date: Date): number | null {
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const match = monthBoundaries(cohort).find((b) => b.start <= iso && iso <= b.end)
  return match?.month ?? null
}

// True while a published session is running
export function isLive(session: SessionResponse, now: Date = new Date()): boolean {
  if (session.status !== 'published') return false
  return new Date(session.starts_at) <= now && now < new Date(session.ends_at)
}

export function minutesBetween(startIso: string, endIso: string): number {
  return Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000)
}
