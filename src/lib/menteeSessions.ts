// Loading and reshaping shared by the mentee home and sessions screens

import { api } from '@/lib/api'
import { formatDateTime, formatDay, formatTime, fullName } from '@/lib/format'
import { closesInLabel } from '@/lib/menteeDashboard'
import { leadMentor, monthBoundaries, monthForDate, sessionPillar } from '@/lib/sessions'
import type { AttendanceRatings, AttendanceStatus, MyAttendanceResponse } from '@/types/attendance'
import type { MenteeOverviewResponse, SessionPointsEntry } from '@/types/dashboard'
import type { OpenSession } from '@/types/home'
import type { HistoryFilters, HistoryRow, UpcomingSession } from '@/types/menteeSessions'
import type { SessionResponse } from '@/types/session'

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

// History marks a session "upcoming" once it has started and still waits on the mentee, and
// only lists sessions that apply to them. So this never offers an Attend the server would
// refuse. The window then says when it closes, including any personal override.
export async function loadOpenSessions(cohortId: string): Promise<OpenSession[]> {
  const entries = await api.dashboard.mentee.history(cohortId)
  const waiting = entries.filter((entry) => entry.outcome === 'upcoming')
  const results = await Promise.allSettled(
    waiting.map(async (entry) => {
      const [session, window] = await Promise.all([
        api.sessions.getById(entry.session_id),
        api.sessions.attendanceWindow(entry.session_id),
      ])
      return { session, window }
    })
  )
  return results
    .flatMap((result) => {
      if (result.status === 'rejected') return []
      const { session, window } = result.value
      const isWaiting =
        window.is_open && (window.record_status === null || window.record_status === 'pending')
      if (!isWaiting) return []
      const leader = leadMentor(session)
      return [
        {
          id: session.id,
          title: session.title,
          startsAt: session.starts_at,
          endsAt: session.ends_at,
          pillar: sessionPillar(session),
          leaderName: leader ? fullName(leader) : null,
          points: session.points,
          closesAt: window.effective_closes_at,
        },
      ]
    })
    .sort((a, b) => a.closesAt.localeCompare(b.closesAt))
    .map(({ closesAt, ...session }) => ({ ...session, closesInLabel: closesInLabel(closesAt) }))
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

// A record is the fuller answer. With none, the session closed without a submission.
function historyState(
  entry: SessionPointsEntry,
  record: MyAttendanceResponse | undefined
): AttendanceStatus {
  if (record && record.status !== 'pending') return record.status
  if (entry.outcome === 'attended') return 'attended'
  if (entry.outcome === 'excused') return 'excused'
  return 'missed'
}

export function ratingsOf(record: AttendanceRatings | undefined): HistoryRow['ratings'] {
  if (!record) return []
  return [
    { label: 'Quality', value: record.quality_rating },
    { label: 'Usefulness', value: record.usefulness_rating },
    { label: 'Understanding', value: record.understanding_score },
    { label: 'Academic application', value: record.academic_application_score },
    { label: 'Career application', value: record.career_application_score },
  ].flatMap(({ label, value }) => (value === null || value === undefined ? [] : [{ label, value }]))
}

// Joins the history list with the mentee's own records and the session details
export function historyRows(
  entries: SessionPointsEntry[],
  records: MyAttendanceResponse[],
  sessions: SessionResponse[]
): HistoryRow[] {
  const recordFor = new Map(records.map((record) => [record.session_id, record]))
  const sessionFor = new Map(sessions.map((session) => [session.id, session]))
  return entries
    .filter((entry) => entry.outcome !== 'upcoming')
    .map((entry) => {
      const record = recordFor.get(entry.session_id)
      const session = sessionFor.get(entry.session_id)
      return {
        sessionId: entry.session_id,
        title: entry.title,
        startsAt: entry.starts_at,
        endsAt: session?.ends_at ?? null,
        month: entry.kami_limu_month,
        pillar: sessionPillar({ session_type: entry.session_type, track: entry.track }),
        track: entry.track,
        sessionType: entry.session_type,
        state: historyState(entry, record),
        pointsEarned: entry.points_earned,
        ratings: ratingsOf(record),
        feedback: record?.feedback ?? null,
        notes: record?.personal_notes ?? null,
        materialsUrl: session?.resources[0]?.url ?? null,
      }
    })
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
