// A peer mentor's facilitator numbers: the sessions they led or co-led (session_mentors),
// rated by everyone who attended, from GET /sessions/{id}/feedback. Nothing here covers
// other peer mentors yet. Their own group's peer mentorship feedback is in lib/peerMentor.ts.

import { api, fetchAllPages } from '@/lib/api'
import { averageOf } from '@/lib/peerMentor'
import { feedbackGroups, overallAverage, writtenFeedback } from '@/lib/sessionFeedback'
import { sessionPillar } from '@/lib/sessions'
import type {
  FacilitatorSessionRow,
  FacilitatorView,
  RatingPointView,
  SessionRatingsView,
} from '@/types/peerMentor'
import type { SessionResponse } from '@/types/session'

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

function isMentor(session: SessionResponse, userId: string): boolean {
  return session.mentors.some((mentor) => mentor.user.id === userId)
}

// Sessions in the cohort that have started, that this person leads or co-leads
async function mentoredSessions(
  cohortId: string | null,
  userId: string,
  now: Date
): Promise<SessionResponse[]> {
  const sessions = await fetchAllPages((page, pageSize) =>
    api.sessions.list({
      cohort_id: cohortId ?? undefined,
      starts_before: now.toISOString(),
      page,
      page_size: pageSize,
    })
  )
  return sessions.filter(
    (session) =>
      (session.status === 'published' || session.status === 'completed') &&
      isMentor(session, userId)
  )
}

export async function loadFacilitator(
  cohortId: string | null,
  userId: string,
  now: Date = new Date()
): Promise<FacilitatorView> {
  const sessions = await mentoredSessions(cohortId, userId, now)
  const rows = await Promise.all(
    sessions.map(async (session): Promise<FacilitatorSessionRow> => {
      const [window, feedback] = await Promise.all([
        api.sessions.attendanceWindow(session.id).catch(() => null),
        api.sessions.feedback(session.id),
      ])
      const closesAt = window?.effective_closes_at ?? session.ends_at
      return {
        id: session.id,
        title: session.title,
        startsAt: session.starts_at,
        isInProgress: new Date(closesAt) > now,
        rating: overallAverage(feedback),
        responses: feedback.responses,
      }
    })
  )
  return facilitatorView(rows)
}

export async function loadSessionRatings(
  sessionId: string,
  cohortId: string | null,
  userId: string
): Promise<SessionRatingsView> {
  const [session, feedback, facilitator] = await Promise.all([
    api.sessions.getById(sessionId),
    api.sessions.feedback(sessionId),
    loadFacilitator(cohortId, userId),
  ])
  return {
    session: {
      id: session.id,
      title: session.title,
      startsAt: session.starts_at,
      pillar: sessionPillar(session),
      responses: feedback.responses,
      average: overallAverage(feedback),
      groups: feedbackGroups(feedback),
      feedback: writtenFeedback(feedback),
    },
    averageAcrossSessions: facilitator.average,
  }
}
