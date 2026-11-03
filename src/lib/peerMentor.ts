// =============================================================================
// Turns the peer mentor API responses into read-only views of a mentee
// =============================================================================

import { api, fetchAllPages } from '@/lib/api'
import { formatDateTime, formatDay, toDateTimeLocal } from '@/lib/format'
import { closesInLabel } from '@/lib/menteeDashboard'
import { ratingsOf } from '@/lib/menteeSessions'
import { RATING_POINTS, skillLabel } from '@/lib/menteeObjectives'
import type { ActivityType } from '@/types/activity'
import type { AttendanceRatings, AttendanceResponse, AttendanceStatus } from '@/types/attendance'
import type { MenteeDrilldown, MenteeSummary, SessionPointsEntry } from '@/types/dashboard'
import type {
  MenteeAttendanceRow,
  MenteeCardView,
  MenteeDetailView,
  MenteeFeedbackRow,
  FeedbackGroupView,
  GroupFeedbackView,
  GroupMeetingView,
  MenteeObjectiveRow,
  PeerSessionView,
} from '@/types/peerMentor'
import type { SessionResponse } from '@/types/session'
import type { RatingPoint, SkillProgressResponse } from '@/types/skills'

const POINT_LABELS: Record<RatingPoint, string> = { early: 'Start', mid: 'Mid', late: 'End' }

const ACTIVITY_ROWS: { type: ActivityType; label: string }[] = [
  { type: 'consultation', label: 'Consultations' },
  { type: 'event', label: 'External events' },
  // The API has one type for job and scholarship applications. See docs/api-gaps.md.
  { type: 'opportunity', label: 'Applications' },
  { type: 'academic', label: 'KamiLimu to Academia' },
]

export function menteeCard(summary: MenteeSummary): MenteeCardView {
  const { first_name, last_name, id } = summary.mentee
  return {
    id,
    name: `${first_name} ${last_name}`.trim(),
    coreRate: summary.core_rate,
    overallRate: summary.combined_rate,
    points: summary.total_points,
  }
}

function attendanceState(
  entry: SessionPointsEntry,
  record: AttendanceResponse | undefined
): AttendanceStatus {
  if (record && record.status !== 'pending') return record.status
  if (entry.outcome === 'attended') return 'attended'
  if (entry.outcome === 'excused') return 'excused'
  return 'missed'
}

function attendanceRows(
  entries: SessionPointsEntry[],
  records: AttendanceResponse[]
): MenteeAttendanceRow[] {
  return entries
    .filter((entry) => entry.outcome !== 'upcoming')
    .map((entry) => ({
      sessionId: entry.session_id,
      title: entry.title,
      startsAt: entry.starts_at,
      state: attendanceState(
        entry,
        records.find((record) => record.session_id === entry.session_id)
      ),
    }))
}

function objectiveRows(progress: SkillProgressResponse): MenteeObjectiveRow[] {
  return progress.skill_names.map((skill) => {
    const scores = RATING_POINTS.flatMap((point) => {
      const score = progress.ratings.find((rating) => rating.rating_point === point)?.ratings[skill]
      return score === undefined ? [] : [`${POINT_LABELS[point]} ${score}`]
    })
    return {
      skill,
      label: skillLabel(skill),
      summary: scores.length > 0 ? scores.join(', ') : 'Not yet rated',
    }
  })
}

function feedbackRows(records: AttendanceResponse[]): MenteeFeedbackRow[] {
  return records.flatMap((record) => {
    const ratings = ratingsOf(record)
    if (ratings.length === 0 && !record.feedback) return []
    return [
      {
        sessionId: record.session_id,
        title: record.session.title,
        ratings,
        feedback: record.feedback,
      },
    ]
  })
}

export function menteeDetail(
  drilldown: MenteeDrilldown,
  progress: SkillProgressResponse | null,
  records: AttendanceResponse[] | null
): MenteeDetailView {
  return {
    card: menteeCard(drilldown.summary),
    attendance: attendanceRows(drilldown.points.sessions, records ?? []),
    objectives: progress ? objectiveRows(progress) : null,
    activities: ACTIVITY_ROWS.map(({ type, label }) => ({
      label,
      count: drilldown.points.extra_activities.filter((activity) => activity.type === type).length,
    })),
    feedback: records ? feedbackRows(records) : null,
  }
}

// The session to show: the latest one that has started, or else the next one
function currentSession(sessions: SessionResponse[], now: Date): SessionResponse | null {
  const byStart = [...sessions].sort((a, b) => a.starts_at.localeCompare(b.starts_at))
  const started = byStart.filter((session) => new Date(session.starts_at) <= now)
  return started[started.length - 1] ?? byStart[0] ?? null
}

// The group's current peer mentorship session and how many mentees have submitted.
// null when the cohort has none.
export async function loadPeerSession(now: Date = new Date()): Promise<PeerSessionView | null> {
  const group = await api.peerMentor.group()
  const sessions = await fetchAllPages((page, pageSize) =>
    api.sessions.list({
      cohort_id: group.cohort_id,
      category: 'peer_mentorship',
      status: 'published',
      page,
      page_size: pageSize,
    })
  )
  const session = currentSession(sessions, now)
  if (!session) return null

  const [window, records] = await Promise.all([
    api.sessions.attendanceWindow(session.id).catch(() => null),
    api.peerMentor.groupAttendance({ session_id: session.id, page_size: 100 }),
  ])
  const hasStarted = new Date(session.starts_at) <= now
  const isOpen = window?.is_open ?? false
  return {
    id: session.id,
    title: session.title,
    startsAt: session.starts_at,
    endsAt: session.ends_at,
    windowLabel:
      isOpen && window
        ? closesInLabel(window.effective_closes_at, now)
        : hasStarted
          ? 'Closed'
          : null,
    isOpen,
    submitted: records.items.filter((record) => record.status !== 'pending').length,
    groupSize: group.mentees.length,
  }
}

// The design asks nine questions in three groups. The API collects five ratings, so each
// sits in the group it fits best. See docs/api-gaps.md.
const FEEDBACK_GROUPS: {
  label: string
  questions: { label: string; key: keyof AttendanceRatings }[]
}[] = [
  {
    label: 'Reaction',
    questions: [
      { label: 'Quality of the session', key: 'quality_rating' },
      { label: 'How useful it was', key: 'usefulness_rating' },
    ],
  },
  {
    label: 'Learning',
    questions: [{ label: 'How well they understood it', key: 'understanding_score' }],
  },
  {
    label: 'Intended behaviour',
    questions: [
      { label: 'Will apply it in their studies', key: 'academic_application_score' },
      { label: 'Will apply it in their career', key: 'career_application_score' },
    ],
  },
]

export function averageOf(values: number[]): number | null {
  if (values.length === 0) return null
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10
}

function answers(records: AttendanceResponse[], key: keyof AttendanceRatings): number[] {
  return records.flatMap((record) => {
    const value = record[key]
    return typeof value === 'number' ? [value] : []
  })
}

export function groupFeedback(
  session: SessionResponse,
  closesAt: string | null,
  records: AttendanceResponse[],
  groupSize: number,
  now: Date = new Date()
): GroupFeedbackView {
  // Ratings only count from mentees who attended
  const attended = records.filter((record) => record.status === 'attended')
  const groups: FeedbackGroupView[] = FEEDBACK_GROUPS.map((group) => ({
    label: group.label,
    questions: group.questions.map((question) => ({
      label: question.label,
      average: averageOf(answers(attended, question.key)),
    })),
  }))
  const everyAnswer = FEEDBACK_GROUPS.flatMap((group) =>
    group.questions.flatMap((question) => answers(attended, question.key))
  )
  return {
    id: session.id,
    title: session.title,
    startsAt: session.starts_at,
    endsAt: session.ends_at,
    windowLine: closesAt
      ? `Window ${new Date(closesAt) > now ? 'closes' : 'closed'} ${formatDateTime(closesAt)}`
      : null,
    submitted: records.filter((record) => record.status !== 'pending').length,
    groupSize,
    average: averageOf(everyAnswer),
    groups,
    feedback: attended.flatMap((record) => {
      const text = record.feedback?.trim()
      return text ? [text] : []
    }),
  }
}

export async function loadGroupFeedback(sessionId: string): Promise<GroupFeedbackView> {
  const [group, session, window, records] = await Promise.all([
    api.peerMentor.group(),
    api.sessions.getById(sessionId),
    api.sessions.attendanceWindow(sessionId).catch(() => null),
    api.peerMentor.groupAttendance({ session_id: sessionId, page_size: 100 }),
  ])
  return groupFeedback(
    session,
    window?.effective_closes_at ?? null,
    records.items,
    group.mentees.length
  )
}

// The group meeting is for the first peer mentorship session whose window hasn't closed.
// null when there is none to plan for.
export async function loadGroupMeeting(now: Date = new Date()): Promise<GroupMeetingView | null> {
  const group = await api.peerMentor.group()
  const sessions = await fetchAllPages((page, pageSize) =>
    api.sessions.list({
      cohort_id: group.cohort_id,
      category: 'peer_mentorship',
      status: 'published',
      page,
      page_size: pageSize,
    })
  )
  const byStart = [...sessions].sort((a, b) => a.starts_at.localeCompare(b.starts_at))
  for (const session of byStart) {
    const window = await api.sessions.attendanceWindow(session.id).catch(() => null)
    const closesAt = window?.effective_closes_at ?? session.ends_at
    if (new Date(closesAt) <= now) continue
    return {
      sessionId: session.id,
      title: session.title,
      windowLine: `Open ${formatDay(session.starts_at)} to ${formatDateTime(closesAt)}`,
      firstDay: toDateTimeLocal(session.starts_at).slice(0, 10),
      lastDay: toDateTimeLocal(closesAt).slice(0, 10),
      group: group.mentees
        .map((summary) => menteeCard(summary))
        .map(({ id, name }) => ({
          id,
          name,
        })),
    }
  }
  return null
}
