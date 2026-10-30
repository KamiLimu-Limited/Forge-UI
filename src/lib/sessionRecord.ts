// =============================================================================
// Loads one session with the mentee's window and record, for the attendance and
// notes screens, and turns form answers into API requests.
// =============================================================================

import { api } from '@/lib/api'
import { RATING_FIELDS } from '@/lib/attendanceQuestions'
import { formatDateTime, fullName } from '@/lib/format'
import { closesInLabel } from '@/lib/menteeDashboard'
import { upcomingSession } from '@/lib/menteeSessions'
import { sessionPillar } from '@/lib/sessions'
import type { AttendanceRatings } from '@/types/attendance'
import type {
  AttendanceAnswers,
  ExtensionView,
  SessionRecordView,
  WindowState,
} from '@/types/menteeSessions'

export async function loadSessionRecord(sessionId: string): Promise<SessionRecordView> {
  const session = await api.sessions.getById(sessionId)
  const [window, records] = await Promise.all([
    api.sessions.attendanceWindow(sessionId).catch(() => null),
    api.attendance.mine({ session_id: sessionId, cohort_id: session.cohort_id, page_size: 1 }),
  ])
  const record = records.items[0] ?? null
  const now = new Date()
  const hasStarted = new Date(session.starts_at) <= now
  const windowState: WindowState = window?.is_open ? 'open' : hasStarted ? 'closed' : 'upcoming'
  const leader = session.mentors[0]?.user

  return {
    id: session.id,
    title: session.title,
    startsAt: session.starts_at,
    endsAt: session.ends_at,
    pillar: sessionPillar(session),
    leaderName: leader ? fullName(leader) : null,
    points: session.points,
    materialsUrl: session.resources[0]?.url ?? null,
    windowState,
    windowClosesLabel: window ? formatDateTime(window.effective_closes_at) : null,
    closesInLabel: window?.is_open ? closesInLabel(window.effective_closes_at, now) : null,
    opensLabel: upcomingSession(session, now).opensLabel,
    recordId: record?.id ?? null,
    recordState: record?.status ?? null,
    notes: record?.personal_notes ?? null,
    // The record's own time, so it only means something once there are notes
    savedAt: record?.personal_notes ? record.updated_at : null,
  }
}

export async function loadExtension(sessionId: string): Promise<ExtensionView> {
  const [session, requests] = await Promise.all([
    loadSessionRecord(sessionId),
    api.attendance.overrideRequests.list({ session_id: sessionId, page_size: 100 }),
  ])
  const latest = [...requests.items].sort((a, b) => b.created_at.localeCompare(a.created_at))[0]
  return {
    session,
    request: latest
      ? { status: latest.status, sentAt: latest.created_at, reviewReason: latest.review_reason }
      : null,
  }
}

// Ratings go with Present only
export function answersToRequest(answers: AttendanceAnswers): AttendanceRatings & {
  status: AttendanceAnswers['status']
  feedback: string | null
} {
  const isPresent = answers.status === 'attended'
  const ratings: AttendanceRatings = {}
  for (const field of RATING_FIELDS) {
    ratings[field] = isPresent ? (answers.ratings[field] ?? null) : null
  }
  return { status: answers.status, feedback: answers.feedback.trim() || null, ...ratings }
}
