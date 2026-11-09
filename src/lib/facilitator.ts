// =============================================================================
// A peer mentor's facilitator numbers, worked out from their own group's answers.
// The API has no summary for this yet, so nothing here covers other peer mentors.
// =============================================================================

import { api, fetchAllPages } from '@/lib/api'
import { averageOf, groupFeedback, loadGroupFeedback } from '@/lib/peerMentor'
import type {
  FacilitatorSessionRow,
  FacilitatorView,
  RatingPointView,
  SessionRatingsView,
} from '@/types/peerMentor'

// "Peer Mentorship 3" becomes "PM 3" so the chart axis stays short
export function shortSessionLabel(title: string): string {
  const short = title.replace(/^peer mentorship\s*/i, 'PM ')
  return short.length > 10 ? `${short.slice(0, 9)}…` : short
}

export function facilitatorView(rows: FacilitatorSessionRow[]): FacilitatorView {
  const newestFirst = [...rows].sort((a, b) => b.startsAt.localeCompare(a.startsAt))
  const rated = newestFirst.filter(
    (row): row is FacilitatorSessionRow & { rating: number } =>
      !row.isInProgress && row.rating !== null
  )
  const best = rated.reduce<FacilitatorSessionRow | null>(
    (top, row) => (top === null || (top.rating ?? 0) < row.rating ? row : top),
    null
  )
  const trend: RatingPointView[] = [...rated].reverse().map((row) => ({
    label: shortSessionLabel(row.title),
    title: row.title,
    rating: row.rating,
  }))
  return {
    completed: newestFirst.filter((row) => !row.isInProgress).length,
    inProgress: newestFirst.filter((row) => row.isInProgress).length,
    average: averageOf(rated.map((row) => row.rating)),
    best,
    sessions: newestFirst,
    trend,
  }
}

export async function loadFacilitator(
  cohortId: string | null,
  now: Date = new Date()
): Promise<FacilitatorView> {
  const group = await api.peerMentor.group(cohortId)
  const sessions = await fetchAllPages((page, pageSize) =>
    api.sessions.list({
      cohort_id: group.cohort_id,
      category: 'peer_mentorship',
      status: 'published',
      starts_before: now.toISOString(),
      page,
      page_size: pageSize,
    })
  )
  const rows = await Promise.all(
    sessions.map(async (session): Promise<FacilitatorSessionRow> => {
      const [window, records] = await Promise.all([
        api.sessions.attendanceWindow(session.id).catch(() => null),
        api.peerMentor.groupAttendance({ session_id: session.id, page_size: 100 }),
      ])
      const closesAt = window?.effective_closes_at ?? session.ends_at
      return {
        id: session.id,
        title: session.title,
        startsAt: session.starts_at,
        isInProgress: new Date(closesAt) > now,
        rating: groupFeedback(session, closesAt, records.items, group.mentees.length, now).average,
      }
    })
  )
  return facilitatorView(rows)
}

export async function loadSessionRatings(
  sessionId: string,
  cohortId: string | null
): Promise<SessionRatingsView> {
  const [session, facilitator] = await Promise.all([
    loadGroupFeedback(sessionId, cohortId),
    loadFacilitator(cohortId),
  ])
  return { session, averageAcrossSessions: facilitator.average }
}
