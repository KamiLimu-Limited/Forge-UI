// The mentee screens' data for a 1:1 or ICT peer mentor. The mentee overview and history
// routes refuse peer mentors, so these start from the cohort of the peer mentor's role.

import { api, fetchAllPages } from '@/lib/api'
import { closesInLabel } from '@/lib/menteeDashboard'
import { activitiesData } from '@/lib/menteeActivities'
import { objectivesData } from '@/lib/menteeObjectives'
import { historyRows, monthLine, upcomingSession } from '@/lib/menteeSessions'
import { fullName } from '@/lib/format'
import { leadMentor, monthBoundaries, monthForDate, sessionPillar } from '@/lib/sessions'
import type { CohortDetailResponse } from '@/types/cohort'
import type { SessionPointsEntry } from '@/types/dashboard'
import type { OpenSession } from '@/types/home'
import type { MenteeActivitiesData } from '@/types/menteeActivities'
import type { MenteeObjectivesData } from '@/types/menteeObjectives'
import type { MenteeHistoryData, MenteeSessionsData } from '@/types/menteeSessions'
import type { SessionResponse } from '@/types/session'
import type { RatingPoint, SkillRatingWindowStatus } from '@/types/skills'

function cohortMonthLine(cohort: CohortDetailResponse, now: Date): string | null {
  const total = monthBoundaries(cohort).length
  return monthLine({
    programmeMonth: monthForDate(cohort, now),
    totalMonths: total > 0 ? total : null,
  })
}

function loadPublishedSessions(cohortId: string): Promise<SessionResponse[]> {
  return fetchAllPages((page, page_size) =>
    api.sessions.list({ page, page_size, cohort_id: cohortId, status: 'published' })
  )
}

export async function loadPeerSessions(
  cohortId: string,
  now: Date = new Date()
): Promise<MenteeSessionsData> {
  const cohort = await api.cohorts.getById(cohortId)
  const sessions = await loadPublishedSessions(cohort.id)
  const started = sessions.filter((session) => new Date(session.starts_at) <= now)
  const windows = await Promise.allSettled(
    started.map((session) => api.sessions.attendanceWindow(session.id))
  )
  const open: OpenSession[] = started
    .flatMap((session, index) => {
      const result = windows[index]
      if (result.status === 'rejected' || !result.value.is_open) return []
      const leader = leadMentor(session)
      return [{ session, closesAt: result.value.effective_closes_at, leader }]
    })
    .sort((a, b) => a.closesAt.localeCompare(b.closesAt))
    .map(({ session, closesAt, leader }) => ({
      id: session.id,
      title: session.title,
      startsAt: session.starts_at,
      endsAt: session.ends_at,
      pillar: sessionPillar(session),
      leaderName: leader ? fullName(leader) : null,
      points: session.points,
      closesInLabel: closesInLabel(closesAt, now),
    }))
  return {
    monthLine: cohortMonthLine(cohort, now),
    open,
    upcoming: sessions
      .filter((session) => new Date(session.starts_at) > now)
      .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
      .map((session) => upcomingSession(session, now)),
  }
}

// The past sessions with whatever the peer mentor has on record. Without a record a session
// shows as pending, since the API gives peer mentors no outcome or points.
export async function loadPeerHistory(
  cohortId: string,
  now: Date = new Date()
): Promise<MenteeHistoryData> {
  const cohort = await api.cohorts.getById(cohortId)
  const [sessions, records] = await Promise.all([
    loadPublishedSessions(cohort.id),
    fetchAllPages((page, page_size) =>
      api.attendance.mine({ page, page_size, cohort_id: cohort.id })
    ),
  ])
  const entries: SessionPointsEntry[] = sessions
    .filter((session) => new Date(session.starts_at) <= now)
    .sort((a, b) => b.starts_at.localeCompare(a.starts_at))
    .map((session) => ({
      session_id: session.id,
      title: session.title,
      starts_at: session.starts_at,
      kami_limu_month: session.kami_limu_month,
      track: session.track,
      session_type: session.session_type,
      points: session.points,
      outcome: 'absent',
      points_earned: 0,
    }))
  const rows = historyRows(entries, records, sessions).map((row) =>
    records.some((record) => record.session_id === row.sessionId)
      ? row
      : { ...row, state: 'pending' as const }
  )
  return { monthLine: cohortMonthLine(cohort, now), rows }
}

export async function loadPeerActivities(cohortId: string): Promise<MenteeActivitiesData> {
  const activities = await fetchAllPages((page, page_size) =>
    api.extraActivities.mine({ page, page_size, cohort_id: cohortId })
  )
  return activitiesData(activities)
}

const RATING_POINTS: RatingPoint[] = ['early', 'mid', 'late']

// The cohort's skills and rating windows, with no ratings, since the API keeps ratings
// against a mentee enrollment
export async function loadPeerObjectives(
  cohortId: string,
  now: Date = new Date()
): Promise<MenteeObjectivesData> {
  const cohort = await api.cohorts.getById(cohortId)
  const statuses: SkillRatingWindowStatus[] = RATING_POINTS.flatMap((point) => {
    const window = cohort.skill_rating_windows?.[point]
    if (!window) return []
    const isOpen = new Date(window.opens_at) <= now && now <= new Date(window.closes_at)
    return [
      {
        rating_point: point,
        opens_at: window.opens_at,
        closes_at: window.closes_at,
        is_open: isOpen,
        submitted: false,
      },
    ]
  })
  return objectivesData(
    cohort.id,
    {
      mentee_id: '',
      cohort_id: cohort.id,
      skill_names: cohort.skill_names ?? [],
      ratings: [],
      change: {},
    },
    statuses
  )
}
