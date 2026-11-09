// =============================================================================
// Turns the ICT peer mentor API responses into the My track and ICT sessions views
// =============================================================================

import { api, fetchAllPages } from '@/lib/api'
import { fullName } from '@/lib/format'
import type {
  MyTrackView,
  TrackMenteeEntry,
  TrackSessionBrief,
  TrackSessionsView,
} from '@/types/ictPeerMentor'
import { ApiError } from '@/types/auth'
import type { SessionResponse } from '@/types/session'

// The API answers 404 while the System Admin hasn't assigned a track yet
async function loadOverview(cohortId: string) {
  try {
    return await api.ictPeerMentor.trackOverview(cohortId)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

function loadTrackSessions(cohortId: string, track: string): Promise<SessionResponse[]> {
  return fetchAllPages((page, page_size) =>
    api.sessions.list({ page, page_size, cohort_id: cohortId, track, status: 'published' })
  )
}

function brief(session: SessionResponse): TrackSessionBrief {
  return { title: session.title, startsAt: session.starts_at, endsAt: session.ends_at }
}

function nextSession(sessions: SessionResponse[], now: Date): TrackSessionBrief | null {
  const next = sessions
    .filter((session) => new Date(session.ends_at) > now)
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at))[0]
  return next ? brief(next) : null
}

function trackRate(mentees: TrackMenteeEntry[]): number | null {
  const due = mentees.reduce((sum, entry) => sum + entry.track.sessions_due, 0)
  const attended = mentees.reduce((sum, entry) => sum + entry.track.sessions_attended, 0)
  return due > 0 ? Math.round((attended / due) * 100) : null
}

// null when no track is assigned yet
export async function loadMyTrack(
  cohortId: string,
  now: Date = new Date()
): Promise<MyTrackView | null> {
  const overview = await loadOverview(cohortId)
  if (!overview) return null
  const sessions = await loadTrackSessions(cohortId, overview.track).catch(() => [])
  return {
    track: overview.track,
    menteeCount: overview.mentees.length,
    attendanceRate: trackRate(overview.mentees),
    sessionsSoFar: sessions.filter((session) => new Date(session.starts_at) <= now).length,
    nextSession: nextSession(sessions, now),
    mentees: [...overview.mentees]
      .sort(
        (a, b) =>
          b.track.sessions_attended - a.track.sessions_attended ||
          b.track.points_earned - a.track.points_earned
      )
      .map((entry) => ({
        id: entry.mentee.id,
        name: fullName(entry.mentee),
        attendedLabel: `${entry.track.sessions_attended} of ${entry.track.sessions_due}`,
        points: entry.track.points_earned,
      })),
  }
}

// null when no track is assigned yet
export async function loadTrackSessionsView(
  cohortId: string,
  now: Date = new Date()
): Promise<TrackSessionsView | null> {
  const overview = await loadOverview(cohortId)
  if (!overview) return null
  const [sessions, stats] = await Promise.all([
    loadTrackSessions(cohortId, overview.track),
    api.ictPeerMentor.sessions(cohortId),
  ])
  const statsFor = new Map(stats.map((entry) => [entry.session.id, entry]))
  const today = now.toDateString()
  return {
    track: overview.track,
    menteeCount: overview.mentees.length,
    sessions: sessions
      .filter(
        (session) =>
          new Date(session.starts_at) <= now || new Date(session.starts_at).toDateString() === today
      )
      .sort((a, b) => b.starts_at.localeCompare(a.starts_at))
      .map((session) => {
        const entry = statsFor.get(session.id)
        const isToday = new Date(session.starts_at).toDateString() === today
        return {
          ...brief(session),
          id: session.id,
          isToday,
          attendedLabel: entry && !isToday ? `${entry.attended} of ${entry.eligible}` : null,
          materialsUrl: session.resources[0]?.url ?? null,
        }
      }),
    next: nextSession(
      sessions.filter((session) => new Date(session.starts_at).toDateString() !== today),
      now
    ),
  }
}
