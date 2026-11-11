// Loading and reshaping shared by the mentee home and sessions screens

import { api } from '@/lib/api'
import { formatDateTime, formatDay, formatTime, fullName } from '@/lib/format'
import { closesInLabel } from '@/lib/menteeDashboard'
import { leadMentor, monthBoundaries, monthForDate, sessionPillar } from '@/lib/sessions'
import { ratingsOf } from '@/lib/attendanceQuestions'
import type { AttendanceResponse, AttendanceStatus } from '@/types/attendance'
import type { MenteeOverviewResponse, SessionPointsEntry } from '@/types/dashboard'
import type { OpenSession } from '@/types/home'
import type { HistoryFilters, HistoryRow, UpcomingSession } from '@/types/menteeSessions'
import type { SessionResponse } from '@/types/session'
import type { RatingQuestion } from '@/types/sessionFeedback'

export const ALL_FILTERS: HistoryFilters = { month: '', track: '', state: '', type: '' }

export interface ProgrammeMonth {
  programmeMonth: number | null
  totalMonths: number | null
}

export async function loadProgrammeMonth(
  overview: MenteeOverviewResponse
): Promise<ProgrammeMonth> {
  const cohort = await api.cohorts.getById(overview.cohort_id).catch(() => null)
  const totalMonths = monthBoundaries(cohort).length
  return {
    programmeMonth:
      (cohort && monthForDate(cohort, new Date())) ??
      overview.next_session?.kami_limu_month ??
      null,
    totalMonths: totalMonths > 0 ? totalMonths : null,
  }
}

// "Month 5 of 8", "Month 5", or null when the month isn't known
export function monthLine({ programmeMonth, totalMonths }: ProgrammeMonth): string | null {
  if (!programmeMonth) return null
  return `Month ${programmeMonth}${totalMonths ? ` of ${totalMonths}` : ''}`
}

// The caller's sessions with an open window that they haven't submitted yet, soonest
// closing first. Includes windows reopened for them. Not filtered by cohort: the API lists
// the caller's own, and the active view's cohort narrows it.
export async function loadOpenSessions(cohortId: string): Promise<OpenSession[]> {
  const sessions = await api.sessions.inProgress()
  return sessions
    .filter((entry) => !entry.submitted && entry.session.cohort_id === cohortId)
    .map(({ session, closes_at }) => {
      const leader = leadMentor(session)
      return {
        id: session.id,
        title: session.title,
        startsAt: session.starts_at,
        endsAt: session.ends_at,
        pillar: sessionPillar(session),
        leaderName: leader ? fullName(leader) : null,
        points: session.points,
        closesInLabel: closesInLabel(closes_at),
      }
    })
}

export function upcomingSession(session: SessionResponse, now: Date = new Date()): UpcomingSession {
  const isToday = new Date(session.starts_at).toDateString() === now.toDateString()
  return {
    id: session.id,
    title: session.title,
    startsAt: session.starts_at,
    endsAt: session.ends_at,
    pillar: sessionPillar(session),
    dayLabel: isToday ? 'Today' : formatDay(session.starts_at),
    opensLabel: isToday
      ? `Opens at ${formatTime(session.starts_at)}`
      : `Opens ${formatDateTime(session.starts_at)}`,
  }
}

// A record is the fuller answer. With none, the outcome says what happened.
function historyState(
  entry: SessionPointsEntry,
  record: AttendanceResponse | undefined
): AttendanceStatus {
  if (record && record.status !== 'pending') return record.status
  if (entry.outcome === 'remaining') return 'pending'
  return entry.outcome
}

// Joins the history list with the mentee's own records and the session details. Sessions
// still to come are left out.
export function historyRows(
  entries: SessionPointsEntry[],
  records: AttendanceResponse[],
  sessions: SessionResponse[],
  questions: RatingQuestion[],
  // Session id to the mentee's notes
  notes: Map<string, string> = new Map()
): HistoryRow[] {
  const recordFor = new Map(records.map((record) => [record.session_id, record]))
  const sessionFor = new Map(sessions.map((session) => [session.id, session]))
  return entries
    .filter((entry) => entry.outcome !== 'remaining')
    .map((entry) => {
      const record = recordFor.get(entry.session_id)
      const session = sessionFor.get(entry.session_id)
      return {
        sessionId: entry.session_id,
        title: entry.title,
        startsAt: entry.starts_at,
        endsAt: session?.ends_at ?? null,
        month: entry.kami_limu_month,
        pillar: sessionPillar({ track: entry.track }),
        track: entry.track,
        sessionType: entry.session_type,
        state: historyState(entry, record),
        pointsEarned: entry.points_earned,
        isReopened: record?.source === 'reopened',
        ratings: ratingsOf(record?.ratings, questions),
        feedback: record?.feedback ?? null,
        notes: notes.get(entry.session_id) ?? null,
        materialsUrl: session?.resources[0]?.url ?? null,
      }
    })
}

// Notes have their own route per session, so each past session is asked for. A 404 means none.
export async function loadHistoryNotes(sessionIds: string[]): Promise<Map<string, string>> {
  const found = await Promise.all(
    sessionIds.map((id) =>
      api.sessions
        .myNotes(id)
        .then((note) => (note.body.trim() ? ([id, note.body] as const) : null))
        .catch(() => null)
    )
  )
  return new Map(found.filter((entry): entry is readonly [string, string] => entry !== null))
}

export function filterHistory(rows: HistoryRow[], filters: HistoryFilters): HistoryRow[] {
  return rows.filter(
    (row) =>
      (!filters.month || String(row.month) === filters.month) &&
      (!filters.track || row.track === filters.track) &&
      (!filters.state || row.state === filters.state) &&
      (!filters.type || row.sessionType === filters.type)
  )
}
