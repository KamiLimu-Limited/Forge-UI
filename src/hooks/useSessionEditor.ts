'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import { errorMessage } from '@/lib/errors'
import { fromDateTimeLocal, toDateTimeLocal } from '@/lib/format'
import { minutesBetween } from '@/lib/sessions'
import type { CohortResponse } from '@/types/cohort'
import type {
  MentorAssignment,
  ResourceIn,
  SessionCategory,
  SessionDetailResponse,
  SessionMode,
  SessionResponse,
  SessionType,
  SessionUpdateRequest,
} from '@/types/session'

export type SessionPillarChoice = 'none' | 'ict'

export interface SessionFormValues {
  title: string
  description: string
  pillar: SessionPillarChoice
  ictTrack: string
  category: SessionCategory
  // '' lets the API work the month out from the start date
  month: string
  start: string
  end: string
  mode: SessionMode
  location: string
  points: number
  attendanceDeadline: string
  leadMentorId: string
  coMentorIds: string[]
  resourceUrl: string
  rescheduleReason: string
}

export type SessionFormErrors = Partial<Record<keyof SessionFormValues, string>>

export interface SaveResult {
  ok: boolean
  message: string
  session?: SessionResponse
}

interface UseSessionEditorOptions {
  cohort: CohortResponse | null
  // The session being edited; omit to create a new one
  session?: SessionDetailResponse | null
}

export interface UseSessionEditorReturn {
  values: SessionFormValues
  setValue: <K extends keyof SessionFormValues>(key: K, value: SessionFormValues[K]) => void
  errors: SessionFormErrors
  isSaving: boolean
  saveError: string | null
  // True on edit when the start or end differs from the saved session
  timeChanged: boolean
  isDirty: boolean
  save: (publish: boolean) => Promise<SaveResult>
}

export const DEFAULT_POINTS = 10

function blankValues(): SessionFormValues {
  return {
    title: '',
    description: '',
    pillar: 'none',
    ictTrack: '',
    category: 'thursday',
    month: '',
    start: '',
    end: '',
    mode: 'virtual',
    location: '',
    points: DEFAULT_POINTS,
    attendanceDeadline: '',
    leadMentorId: '',
    coMentorIds: [],
    resourceUrl: '',
    rescheduleReason: '',
  }
}

function valuesFromSession(session: SessionDetailResponse): SessionFormValues {
  const lead = session.mentors.find((m) => m.mentor_role === 'lead')
  return {
    title: session.title,
    description: session.description ?? '',
    pillar: session.session_type === 'ict' || session.track ? 'ict' : 'none',
    ictTrack: session.track ?? '',
    category: session.category,
    month: String(session.kami_limu_month),
    start: toDateTimeLocal(session.starts_at),
    end: toDateTimeLocal(session.ends_at),
    mode: session.mode,
    location: session.location ?? '',
    points: session.points,
    attendanceDeadline: session.attendance_deadline
      ? toDateTimeLocal(session.attendance_deadline)
      : '',
    leadMentorId: lead?.user.id ?? '',
    coMentorIds: session.mentors.filter((m) => m.mentor_role === 'co_mentor').map((m) => m.user.id),
    resourceUrl: session.resources[0]?.url ?? '',
    rescheduleReason: '',
  }
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function sessionTypeFor(values: SessionFormValues, original?: SessionType): SessionType {
  if (values.category === 'peer_mentorship') return 'peer_mentorship'
  if (values.pillar === 'ict') return 'ict'
  return original === 'professional' ? 'professional' : 'core'
}

function mentorList(values: SessionFormValues): MentorAssignment[] {
  const list: MentorAssignment[] = []
  if (values.leadMentorId) list.push({ user_id: values.leadMentorId, mentor_role: 'lead' })
  for (const id of values.coMentorIds) {
    if (id !== values.leadMentorId) list.push({ user_id: id, mentor_role: 'co_mentor' })
  }
  return list
}

function mentorKey(list: MentorAssignment[]): string {
  return list
    .map((m) => `${m.mentor_role ?? 'lead'}:${m.user_id}`)
    .sort()
    .join('|')
}

export function validateSession(
  values: SessionFormValues,
  options: { timeChanged: boolean; isEdit: boolean }
): SessionFormErrors {
  const errors: SessionFormErrors = {}
  if (!values.title.trim()) errors.title = 'Add a title.'
  else if (values.title.trim().length > 200) errors.title = 'Keep the title under 200 characters.'
  if (values.pillar === 'ict' && !values.ictTrack) errors.ictTrack = 'Choose the ICT track.'
  const start = fromDateTimeLocal(values.start)
  const end = fromDateTimeLocal(values.end)
  if (!start) errors.start = 'Choose when the session starts.'
  if (!end) errors.end = 'Choose when the session ends.'
  if (start && end && end <= start) errors.end = 'The end must be after the start.'
  if (values.resourceUrl.trim() && !isHttpUrl(values.resourceUrl.trim())) {
    errors.resourceUrl = 'Enter a full link that starts with https://'
  }
  if (values.attendanceDeadline && !fromDateTimeLocal(values.attendanceDeadline)) {
    errors.attendanceDeadline = 'Choose a valid deadline.'
  }
  if (options.isEdit && options.timeChanged && !values.rescheduleReason.trim()) {
    errors.rescheduleReason = 'Say why the time is changing. Everyone enrolled sees this.'
  }
  return errors
}

export function useSessionEditor({
  cohort,
  session,
}: UseSessionEditorOptions): UseSessionEditorReturn {
  const isEdit = Boolean(session)
  const initial = useMemo(() => (session ? valuesFromSession(session) : blankValues()), [session])
  const [values, setValues] = useState<SessionFormValues>(initial)
  const [errors, setErrors] = useState<SessionFormErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Reload the form when the saved session changes
  useEffect(() => {
    setValues(initial)
    setErrors({})
  }, [initial])

  const setValue = useCallback(
    <K extends keyof SessionFormValues>(key: K, value: SessionFormValues[K]) => {
      setValues((current) => ({ ...current, [key]: value }))
      setErrors((current) => ({ ...current, [key]: undefined }))
    },
    []
  )

  const timeChanged = isEdit && (values.start !== initial.start || values.end !== initial.end)
  const isDirty = JSON.stringify(values) !== JSON.stringify(initial)

  const create = async (publish: boolean): Promise<SaveResult> => {
    if (!cohort) return { ok: false, message: 'Choose a cohort first.' }
    const startsAt = fromDateTimeLocal(values.start) as string
    const endsAt = fromDateTimeLocal(values.end) as string
    const resources: ResourceIn[] = values.resourceUrl.trim()
      ? [{ resource_type: 'drive_folder', url: values.resourceUrl.trim() }]
      : []
    const created = await api.sessions.create({
      cohort_id: cohort.id,
      title: values.title.trim(),
      description: values.description.trim() || null,
      starts_at: startsAt,
      duration_minutes: minutesBetween(startsAt, endsAt),
      category: values.category,
      session_type: sessionTypeFor(values),
      track: values.pillar === 'ict' ? values.ictTrack : null,
      kami_limu_month: values.month ? Number(values.month) : null,
      mode: values.mode,
      location: values.location.trim() || null,
      points: values.points,
      attendance_deadline:
        values.category === 'peer_mentorship' ? fromDateTimeLocal(values.attendanceDeadline) : null,
      status: publish ? 'published' : 'draft',
      mentors: mentorList(values),
      resources,
    })
    return {
      ok: true,
      session: created,
      message: publish ? 'Session published. The cohort has been notified.' : 'Draft saved.',
    }
  }

  const update = async (current: SessionDetailResponse, publish: boolean): Promise<SaveResult> => {
    const done: string[] = []
    const step = async (label: string, run: () => Promise<unknown>) => {
      try {
        await run()
        done.push(label)
      } catch (err: unknown) {
        const saved = done.length > 0 ? `${done.join(' and ')} saved, but ` : ''
        throw new Error(
          `${saved}${label.toLowerCase()} did not save: ${errorMessage(err, 'try again.')}`
        )
      }
    }

    const patch: SessionUpdateRequest = {}
    const nextType = sessionTypeFor(values, current.session_type)
    const nextTrack = values.pillar === 'ict' ? values.ictTrack : null
    if (values.title.trim() !== current.title) patch.title = values.title.trim()
    if ((values.description.trim() || null) !== current.description) {
      patch.description = values.description.trim() || null
    }
    if (values.category !== current.category) patch.category = values.category
    if (nextType !== current.session_type) patch.session_type = nextType
    if (nextTrack !== current.track) patch.track = nextTrack
    if (values.mode !== current.mode) patch.mode = values.mode
    if ((values.location.trim() || null) !== current.location) {
      patch.location = values.location.trim() || null
    }
    if (values.points !== current.points) patch.points = values.points
    if (values.month && Number(values.month) !== current.kami_limu_month && !timeChanged) {
      patch.kami_limu_month = Number(values.month)
    }
    const deadline =
      values.category === 'peer_mentorship' ? fromDateTimeLocal(values.attendanceDeadline) : null
    if (
      deadline !==
      (current.attendance_deadline ? new Date(current.attendance_deadline).toISOString() : null)
    ) {
      patch.attendance_deadline = deadline
    }
    if (publish && current.status === 'draft') patch.status = 'published'

    if (Object.keys(patch).length > 0) {
      await step('Details', () => api.sessions.update(current.id, patch))
    }

    if (timeChanged) {
      const startsAt = fromDateTimeLocal(values.start) as string
      const endsAt = fromDateTimeLocal(values.end) as string
      await step('The new time', () =>
        api.sessions.reschedule(current.id, {
          starts_at: startsAt,
          duration_minutes: minutesBetween(startsAt, endsAt),
          reason: values.rescheduleReason.trim(),
        })
      )
    }

    const mentors = mentorList(values)
    const savedMentors = current.mentors.map((m) => ({
      user_id: m.user.id,
      mentor_role: m.mentor_role,
    }))
    if (mentorKey(mentors) !== mentorKey(savedMentors)) {
      await step('Mentors', () => api.sessions.setMentors(current.id, mentors))
    }

    const url = values.resourceUrl.trim()
    if (url !== (current.resources[0]?.url ?? '')) {
      const rest: ResourceIn[] = current.resources.slice(1).map((r) => ({
        resource_type: r.resource_type,
        url: r.url,
        description: r.description,
      }))
      const first: ResourceIn[] = url
        ? [{ resource_type: current.resources[0]?.resource_type ?? 'drive_folder', url }]
        : []
      await step('The resource link', () =>
        api.sessions.setResources(current.id, [...first, ...rest])
      )
    }

    if (done.length === 0) return { ok: true, message: 'Nothing to save. No changes were made.' }
    const fresh = await api.sessions.getById(current.id)
    return {
      ok: true,
      session: fresh,
      message: timeChanged
        ? 'Session rescheduled. Everyone enrolled and the mentors have been emailed.'
        : patch.status === 'published'
          ? 'Session published. The cohort has been notified.'
          : 'Changes saved.',
    }
  }

  const save = async (publish: boolean): Promise<SaveResult> => {
    const found = validateSession(values, { timeChanged, isEdit })
    setErrors(found)
    if (Object.values(found).some(Boolean)) {
      return { ok: false, message: 'Check the highlighted fields.' }
    }
    setIsSaving(true)
    setSaveError(null)
    try {
      return session ? await update(session, publish) : await create(publish)
    } catch (err: unknown) {
      const message =
        err instanceof Error && !(err instanceof TypeError) && err.name === 'Error'
          ? err.message
          : errorMessage(err, "The session didn't save. Try again.")
      setSaveError(message)
      return { ok: false, message }
    } finally {
      setIsSaving(false)
    }
  }

  return { values, setValue, errors, isSaving, saveError, timeChanged, isDirty, save }
}
