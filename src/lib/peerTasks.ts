// Peer mentorship tasks for the Program Delivery Lead and the System Admin's Group
// meetings. Tasks are sessions, so they come from GET /sessions.

import { api, fetchAllPages } from '@/lib/api'
import { fromDateTimeLocal, fullName, toDateTimeLocal } from '@/lib/format'
import { SESSION_STATUS_LABELS } from '@/lib/labels'
import { monthBoundaries, monthLabel } from '@/lib/sessions'
import type { GroupMeetingsView, PeerTaskOption } from '@/types/adminIntegrations'
import type { PeerTaskDraft, PeerTaskFormView, PeerTaskRow, PeerTasksView } from '@/types/peerTasks'
import type { SessionResponse, SessionUpdateRequest } from '@/types/session'

// A task's end time is its deadline
export function dueAt(session: SessionResponse): string {
  return session.ends_at
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

// Creates a published task, or saves what changed on an existing one. A new time goes
// through reschedule so everyone gets the change.
export async function savePeerTask(
  cohortId: string,
  sessionId: string | null,
  draft: PeerTaskDraft
): Promise<SessionResponse> {
  const startsAt = fromDateTimeLocal(draft.opensAt) as string
  const endsAt = fromDateTimeLocal(draft.dueAt) as string
  const link = draft.resourceLink.trim()
  if (!sessionId) {
    return api.sessions.create({
      cohort_id: cohortId,
      title: draft.title.trim(),
      description: draft.description.trim() || null,
      kami_limu_month: draft.month ? Number(draft.month) : null,
      starts_at: startsAt,
      ends_at: endsAt,
      category: 'peer_mentorship',
      points: Number(draft.points),
      status: 'published',
      resources: link ? [{ resource_type: 'drive_folder', url: link }] : [],
    })
  }
  const current = await api.sessions.getById(sessionId)
  const patch: SessionUpdateRequest = {}
  if (draft.title.trim() !== current.title) patch.title = draft.title.trim()
  if ((draft.description.trim() || null) !== current.description) {
    patch.description = draft.description.trim() || null
  }
  if (draft.month && Number(draft.month) !== current.kami_limu_month) {
    patch.kami_limu_month = Number(draft.month)
  }
  if (Number(draft.points) !== current.points) patch.points = Number(draft.points)
  if (Object.keys(patch).length > 0) await api.sessions.update(sessionId, patch)
  const moved =
    new Date(startsAt).getTime() !== new Date(current.starts_at).getTime() ||
    new Date(endsAt).getTime() !== new Date(current.ends_at).getTime()
  if (moved) await api.sessions.reschedule(sessionId, { starts_at: startsAt, ends_at: endsAt })
  if (link !== (current.resources[0]?.url ?? '')) {
    const rest = current.resources.slice(1).map((resource) => ({
      resource_type: resource.resource_type,
      url: resource.url,
      description: resource.description,
    }))
    await api.sessions.setResources(sessionId, [
      ...(link
        ? [{ resource_type: current.resources[0]?.resource_type ?? 'drive_folder', url: link }]
        : []),
      ...rest,
    ])
  }
  return api.sessions.getById(sessionId)
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
  if (draft.resourceLink.trim() && !/^https?:\/\//.test(draft.resourceLink.trim())) {
    errors.resourceLink = 'Enter a full link that starts with https://'
  }
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
      api.cohorts.enrollments.list(cohortId, { page, page_size, role: 'peer_mentor_1_1' })
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
