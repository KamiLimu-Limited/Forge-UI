// A peer mentor's facilitator numbers from the /facilitator routes: the sessions they led or
// co-led, rated by everyone who attended, and the average across all peer mentors. Their own
// group's peer mentorship feedback is in lib/peerMentor.ts.

import { api } from '@/lib/api'
import { feedbackGroupsOf } from '@/lib/sessionFeedback'
import { sessionPillar } from '@/lib/sessions'
import type {
  FacilitatorSessionRow,
  FacilitatorView,
  RatingPointView,
  SessionRatingsView,
} from '@/types/peerMentor'
import type { FacilitatedSession, FacilitatorSummary, RatingTrendPoint } from '@/types/proMentor'

// "Peer Mentorship 3" becomes "PM 3" so the chart axis stays short
export function shortSessionLabel(title: string): string {
  const short = title.replace(/^peer mentorship\s*/i, 'PM ')
  return short.length > 10 ? `${short.slice(0, 9)}…` : short
}

function rounded(value: number | null): number | null {
  return value === null ? null : Math.round(value * 10) / 10
}

// Ratings keep coming in until the session is marked completed
function sessionRow(entry: FacilitatedSession): FacilitatorSessionRow {
  return {
    id: entry.session.id,
    title: entry.session.title,
    startsAt: entry.session.starts_at,
    isInProgress: entry.session.status !== 'completed',
    rating: rounded(entry.average),
    responses: entry.responses,
  }
}

export function facilitatorView(
  summary: FacilitatorSummary,
  sessions: FacilitatedSession[],
  trend: RatingTrendPoint[],
  peerAverage: number | null
): FacilitatorView {
  const points: RatingPointView[] = [...trend]
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
    .flatMap((point) =>
      point.average === null
        ? []
        : [
            {
              label: shortSessionLabel(point.title),
              title: point.title,
              rating: rounded(point.average) as number,
            },
          ]
    )
  return {
    completed: summary.sessions_completed,
    inProgress: summary.sessions_in_progress,
    average: rounded(summary.average),
    peerAverage: rounded(peerAverage),
    best: summary.best_rated_session ? sessionRow(summary.best_rated_session) : null,
    sessions: sessions.map(sessionRow).sort((a, b) => b.startsAt.localeCompare(a.startsAt)),
    trend: points,
  }
}

export async function loadFacilitator(cohortId: string | null): Promise<FacilitatorView> {
  const id = cohortId ?? undefined
  const [summary, sessions, trend, peers] = await Promise.all([
    api.facilitator.summary(id),
    api.facilitator.sessions(id),
    api.facilitator.ratingsOverTime(id).catch(() => []),
    api.facilitator.peerMentorAverage(id).catch(() => null),
  ])
  return facilitatorView(summary, sessions, trend, peers?.average ?? null)
}

export async function loadSessionRatings(
  sessionId: string,
  cohortId: string | null
): Promise<SessionRatingsView> {
  const id = cohortId ?? undefined
  const [ratings, summary, peers] = await Promise.all([
    api.facilitator.sessionRatings(sessionId),
    api.facilitator.summary(id).catch(() => null),
    api.facilitator.peerMentorAverage(id).catch(() => null),
  ])
  return {
    session: {
      id: ratings.session.id,
      title: ratings.session.title,
      startsAt: ratings.session.starts_at,
      pillar: sessionPillar(ratings.session),
      responses: ratings.responses,
      average: rounded(ratings.average),
      groups: feedbackGroupsOf(ratings.questions),
      feedback: ratings.feedback.flatMap((entry) => {
        const text = entry.feedback?.trim()
        return text ? [text] : []
      }),
    },
    averageAcrossSessions: rounded(summary?.average ?? null),
    peerAverage: rounded(peers?.average ?? null),
  }
}
