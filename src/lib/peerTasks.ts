// =============================================================================
// Peer mentorship tasks for the Program Delivery Lead and the System Admin's Group
// meetings. Tasks are sessions, so they come from GET /sessions.
// =============================================================================

import { api, fetchAllPages } from '@/lib/api'
import { fullName, toDateTimeLocal } from '@/lib/format'
import { SESSION_STATUS_LABELS } from '@/lib/labels'
import { monthBoundaries, monthLabel } from '@/lib/sessions'
import type { GroupMeetingsView, PeerTaskOption } from '@/types/adminIntegrations'
import type { PeerTaskDraft, PeerTaskFormView, PeerTaskRow, PeerTasksView } from '@/types/peerTasks'
import type { SessionResponse } from '@/types/session'

export function dueAt(session: SessionResponse): string {
  return session.attendance_deadline ?? session.ends_at
}

export function taskState(session: SessionResponse, now: Date = new Date()): PeerTaskRow['state'] {
  if (session.status === 'draft') return 'draft'
  if (session.status === 'completed' || new Date(dueAt(session)) <= now) return 'completed'
  if (new Date(session.starts_at) <= now) return 'open'
  return 'published'
}

async function loadTaskSessions(cohortId: string): Promise<SessionResponse[]> {
  const sessions = await fetchAllPages((page, page_size) =>
    api.sessions.list({ page, page_size, cohort_id: cohortId, category: 'peer_mentorship' })
  )
  return sessions
    .filter((session) => session.status !== 'cancelled')
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
}

export async function loadPeerTasks(cohortId: string): Promise<PeerTasksView> {
  const [cohort, sessions] = await Promise.all([
    api.cohorts.getById(cohortId).catch(() => null),
    loadTaskSessions(cohortId),
  ])
  const now = new Date()
  return {
    cohortName: cohort?.name ?? null,
    tasks: sessions.map((session) => ({
      id: session.id,
      title: session.title,
      opensAt: session.starts_at,
      dueAt: dueAt(session),
      points: session.points,
      state: taskState(session, now),
    })),
  }
}

const EMPTY_DRAFT: PeerTaskDraft = {
  title: '',
  description: '',
  month: '',
  opensAt: '',
  dueAt: '',
  points: '10',
  pillar: 'personal-dev',
  resourceLink: '',
}

export async function loadPeerTaskForm(
  cohortId: string,
  sessionId: string | null
): Promise<PeerTaskFormView> {
  const [cohort, session] = await Promise.all([
    api.cohorts.getById(cohortId),
    sessionId ? api.sessions.getById(sessionId) : Promise.resolve(null),
  ])
  const months = monthBoundaries(cohort).map((boundary) => ({
    value: String(boundary.month),
    label: monthLabel(boundary.month, boundary),
  }))
  if (!session) return { sessionId: null, statusLabel: null, months, initial: EMPTY_DRAFT }
  return {
    sessionId: session.id,
    statusLabel: SESSION_STATUS_LABELS[session.status],
    months,
    initial: {
      title: session.title,
      description: session.description ?? '',
      month: String(session.kami_limu_month),
      opensAt: toDateTimeLocal(session.starts_at),
      dueAt: toDateTimeLocal(dueAt(session)),
      points: String(session.points),
      // The API has no pillar for non-ICT sessions yet (gap 8)
      pillar: 'personal-dev',
      resourceLink: session.resources[0]?.url ?? '',
    },
  }
}

// What's missing before the task could be saved
export function taskDraftErrors(
  draft: PeerTaskDraft
): Partial<Record<keyof PeerTaskDraft, string>> {
  const errors: Partial<Record<keyof PeerTaskDraft, string>> = {}
  if (!draft.title.trim()) errors.title = 'Give the task a title'
  if (!draft.opensAt) errors.opensAt = 'Choose when it opens'
  if (!draft.dueAt) errors.dueAt = 'Choose when it is due'
  if (draft.opensAt && draft.dueAt && draft.dueAt <= draft.opensAt)
    errors.dueAt = 'Due must be after it opens'
  if (!/^\d+$/.test(draft.points)) errors.points = 'Enter a whole number of points'
  return errors
}

// The 1:1 groups for a task, from the cohort's enrollments. Each group's chosen meeting
// isn't in the API yet (gap M35).
export async function loadGroupMeetings(
  cohortId: string,
  taskId: string | null
): Promise<GroupMeetingsView> {
  const [sessions, mentors, mentees] = await Promise.all([
    loadTaskSessions(cohortId),
    fetchAllPages((page, page_size) =>
      api.cohorts.enrollments.list(cohortId, { page, page_size, role: 'peer_mentor_1:1' })
    ),
    fetchAllPages((page, page_size) =>
      api.cohorts.enrollments.list(cohortId, { page, page_size, role: 'mentee' })
    ),
  ])
  const tasks: PeerTaskOption[] = sessions
    .filter((session) => session.status !== 'draft')
    .map((session) => ({ id: session.id, title: session.title, dueAt: dueAt(session) }))
    .reverse()
  const now = new Date()
  const current =
    tasks.find((task) => task.id === taskId) ??
    [...tasks].reverse().find((task) => new Date(task.dueAt) > now) ??
    tasks[0] ??
    null
  return {
    tasks,
    selectedTaskId: current?.id ?? null,
    groups: mentors
      .map((mentor) => ({
        peerMentorId: mentor.user.id,
        peerMentorName: fullName(mentor.user) || mentor.user.email,
        mentees: mentees
          .filter((mentee) => mentee.peer_mentor_id === mentor.user.id)
          .map((mentee) => fullName(mentee.user) || mentee.user.email),
      }))
      .sort((a, b) => a.peerMentorName.localeCompare(b.peerMentorName)),
  }
}
