'use client'

import { useMemo, useState } from 'react'
import { api, fetchAllPages } from '@/lib/api'
import { errorMessage } from '@/lib/errors'
import { fullName } from '@/lib/format'
import type { EnrollmentResponse } from '@/types/enrollment'
import { useApiQuery } from './useApiQuery'

// A 1:1 peer mentor group holds two to three mentees
export const MAX_GROUP_SIZE = 3

export interface MentorGroup {
  mentor: EnrollmentResponse
  mentees: EnrollmentResponse[]
}

interface SaveSummary {
  saved: number
  failed: string[]
}

interface UseMentorGroupsReturn {
  groups: MentorGroup[]
  unassigned: EnrollmentResponse[]
  isLoading: boolean
  error: string | null
  refetch: () => void
  // Moves a mentee in the local draft. Returns false when the group is already full.
  assign: (menteeEnrollmentId: string, mentorUserId: string | null) => boolean
  isFull: (mentorUserId: string) => boolean
  changeCount: number
  discard: () => void
  save: () => Promise<SaveSummary>
  isSaving: boolean
}

// Draft-then-save editing of 1:1 peer mentor groups. Nothing reaches the API
// until save() sends one PATCH per changed mentee.
export function useMentorGroups(cohortId: string | null): UseMentorGroupsReturn {
  const query = useApiQuery(
    async () => {
      const [mentees, mentors] = await Promise.all([
        fetchAllPages((page, page_size) =>
          api.cohorts.enrollments.list(cohortId as string, { page, page_size, role: 'mentee' })
        ),
        fetchAllPages((page, page_size) =>
          api.cohorts.enrollments.list(cohortId as string, {
            page,
            page_size,
            role: 'peer_mentor_1:1',
          })
        ),
      ])
      return { mentees, mentors }
    },
    [cohortId],
    { enabled: cohortId !== null, fallbackError: "We couldn't load the mentor groups." }
  )
  // Mentee enrollment id to peer mentor user id (null for unassigned)
  const [draft, setDraft] = useState<Record<string, string | null>>({})
  const [isSaving, setIsSaving] = useState(false)

  const mentorOf = (m: EnrollmentResponse): string | null =>
    m.id in draft ? draft[m.id] : m.peer_mentor_id

  const { groups, unassigned } = useMemo(() => {
    const mentees = [...(query.data?.mentees ?? [])].sort((a, b) =>
      fullName(a.user).localeCompare(fullName(b.user))
    )
    const mentors = [...(query.data?.mentors ?? [])].sort((a, b) =>
      fullName(a.user).localeCompare(fullName(b.user))
    )
    const mentorIds = new Set(mentors.map((m) => m.user.id))
    const current = (m: EnrollmentResponse) => (m.id in draft ? draft[m.id] : m.peer_mentor_id)
    return {
      groups: mentors.map((mentor) => ({
        mentor,
        mentees: mentees.filter((m) => current(m) === mentor.user.id),
      })),
      // A mentee whose mentor left the cohort shows as unassigned too
      unassigned: mentees.filter((m) => {
        const id = current(m)
        return !id || !mentorIds.has(id)
      }),
    }
  }, [query.data, draft])

  const isFull = (mentorUserId: string) =>
    (groups.find((g) => g.mentor.user.id === mentorUserId)?.mentees.length ?? 0) >= MAX_GROUP_SIZE

  const assign = (menteeId: string, mentorUserId: string | null) => {
    const mentee = query.data?.mentees.find((m) => m.id === menteeId)
    if (!mentee) return false
    if (mentorOf(mentee) === mentorUserId) return true
    if (mentorUserId && isFull(mentorUserId)) return false
    setDraft((d) => {
      const next = { ...d }
      if (mentee.peer_mentor_id === mentorUserId) delete next[menteeId]
      else next[menteeId] = mentorUserId
      return next
    })
    return true
  }

  const save = async (): Promise<SaveSummary> => {
    const changes = Object.entries(draft)
    if (changes.length === 0) return { saved: 0, failed: [] }
    setIsSaving(true)
    const results = await Promise.all(
      changes.map(async ([enrollmentId, mentorId]) => {
        try {
          const updated = await api.cohorts.enrollments.update(cohortId as string, enrollmentId, {
            peer_mentor_id: mentorId,
          })
          return { enrollmentId, updated, error: null }
        } catch (err: unknown) {
          return { enrollmentId, updated: null, error: errorMessage(err, 'not saved') }
        }
      })
    )
    setIsSaving(false)
    const saved = results.filter((r) => r.updated)
    if (query.data) {
      query.setData({
        ...query.data,
        mentees: query.data.mentees.map(
          (m) => saved.find((r) => r.enrollmentId === m.id)?.updated ?? m
        ),
      })
    }
    // Keep failed moves in the draft so they can be retried
    setDraft((d) => {
      const next = { ...d }
      for (const r of saved) delete next[r.enrollmentId]
      return next
    })
    const failed = results
      .filter((r) => r.error)
      .map((r) => {
        const mentee = query.data?.mentees.find((m) => m.id === r.enrollmentId)
        return `${mentee ? fullName(mentee.user) : 'A mentee'}: ${r.error}`
      })
    return { saved: saved.length, failed }
  }

  return {
    groups,
    unassigned,
    isLoading: query.isLoading,
    error: query.error,
    refetch: () => {
      setDraft({})
      query.refetch()
    },
    assign,
    isFull,
    changeCount: Object.keys(draft).length,
    discard: () => setDraft({}),
    save,
    isSaving,
  }
}
