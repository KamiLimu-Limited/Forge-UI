// Loads one session with the mentee's window and record, for the session detail,
// attendance, notes and extension screens, and turns form answers into API requests.

import { api } from '@/lib/api'
import { ratingGroups } from '@/lib/attendanceQuestions'
import { formatDateTime, fullName, plural } from '@/lib/format'
import { SESSION_TYPE_LABELS } from '@/lib/labels'
import { closesInLabel } from '@/lib/menteeDashboard'
import { upcomingSession } from '@/lib/menteeSessions'
import { leadMentor, sessionPillar } from '@/lib/sessions'
import type {
  AttendanceResponse,
  AttendanceSubmissionRequest,
  WindowStatusResponse,
} from '@/types/attendance'
import type {
  AttendanceAnswers,
  ExtensionView,
  SessionDetailView,
  SessionRecordView,
  WindowState,
} from '@/types/menteeSessions'
import type {
  MentorRole,
  ResourceType,
  SessionDetailResponse,
  SessionNoteResponse,
} from '@/types/session'
import type { RatingQuestion } from '@/types/sessionFeedback'

interface RecordParts {
  session: SessionDetailResponse
  window: WindowStatusResponse | null
  record: AttendanceResponse | null
  questions: RatingQuestion[]
  note: SessionNoteResponse | null
}

function recordView(
  { session, window, record, questions, note }: RecordParts,
  now: Date
): SessionRecordView {
  const hasStarted = new Date(session.starts_at) <= now
  const windowState: WindowState = window?.is_open ? 'open' : hasStarted ? 'closed' : 'upcoming'
  const leader = leadMentor(session)

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
    ratingGroups: ratingGroups(questions),
    notes: note?.body ?? null,
    savedAt: note?.updated_at ?? null,
  }
}

// Once a session has started, a failed window lookup must not read as a closed window, or
// the screen would offer an extension the mentee doesn't need. It fails the load instead,
// so the screen shows the error and Try again. Before the start there may be no window yet.
function loadWindow(
  session: SessionDetailResponse,
  now: Date
): Promise<WindowStatusResponse | null> {
  const request = api.sessions.attendanceWindow(session.id)
  return new Date(session.starts_at) <= now ? request : request.catch(() => null)
}

async function loadParts(sessionId: string, now: Date): Promise<RecordParts> {
  const session = await api.sessions.getById(sessionId)
  const [window, records, questions, note] = await Promise.all([
    loadWindow(session, now),
    api.attendance.mine({ session_id: sessionId, cohort_id: session.cohort_id, page_size: 1 }),
    api.cohorts.ratingQuestions(session.cohort_id),
    // A 404 means no notes yet
    api.sessions.myNotes(sessionId).catch(() => null),
  ])
  return { session, window, record: records.items[0] ?? null, questions, note }
}

export async function loadSessionRecord(sessionId: string): Promise<SessionRecordView> {
  const now = new Date()
  return recordView(await loadParts(sessionId, now), now)
}

const MENTOR_ROLE_LABELS: Record<MentorRole, string> = {
  lead: 'Lead mentor',
  co_mentor: 'Co-mentor',
}

const RESOURCE_LABELS: Record<ResourceType, string> = {
  drive_folder: 'Google Drive folder',
  slides: 'Slides',
  recording: 'Recording',
  document: 'Document',
  other: 'Link',
}

// "Today, starts in 2 hours" for a session starting today, otherwise null
function startsSoonLabel(startsAt: string, now: Date): string | null {
  const start = new Date(startsAt)
  if (start <= now || start.toDateString() !== now.toDateString()) return null
  const minutes = Math.round((start.getTime() - now.getTime()) / 60000)
  return minutes < 60
    ? `Today, starts in ${plural(minutes, 'minute')}`
    : `Today, starts in ${plural(Math.round(minutes / 60), 'hour')}`
}

function movedNote(session: SessionDetailResponse): string | null {
  const last = session.reschedule_history?.[session.reschedule_history.length - 1]
  if (!last) return null
  const reason = last.reason?.trim()
  return `Moved from ${formatDateTime(last.from)}.${reason ? ` Reason from the System Admin: ${reason}` : ''}`
}

export async function loadSessionDetail(sessionId: string): Promise<SessionDetailView> {
  const now = new Date()
  const parts = await loadParts(sessionId, now)
  const { session } = parts
  const isVirtual = session.mode === 'virtual'
  return {
    ...recordView(parts, now),
    isVirtual,
    whereLabel: isVirtual ? 'Virtual' : session.location?.trim() || 'In person',
    typeLabel: SESSION_TYPE_LABELS[session.session_type],
    month: session.kami_limu_month,
    startsSoonLabel: startsSoonLabel(session.starts_at, now),
    movedNote: movedNote(session),
    mentors: session.mentors.map((mentor) => ({
      name: fullName(mentor.user),
      roleLabel: MENTOR_ROLE_LABELS[mentor.mentor_role],
    })),
    materials: session.resources.map((resource) => ({
      url: resource.url,
      title: resource.description?.trim() || 'Session materials',
      kindLabel: RESOURCE_LABELS[resource.resource_type],
    })),
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

// Present sends all nine ratings in question order and the feedback; Absent sends neither
export function answersToRequest(
  answers: AttendanceAnswers,
  fields: number[]
): Omit<AttendanceSubmissionRequest, 'session_id'> {
  if (answers.status === 'absent') return { status: 'absent', ratings: null, feedback: null }
  const ordered = [...fields].sort((a, b) => a - b)
  return {
    status: 'present',
    ratings: ordered.map((field) => answers.ratings[field] ?? 0),
    feedback: answers.feedback.trim() || null,
  }
}
