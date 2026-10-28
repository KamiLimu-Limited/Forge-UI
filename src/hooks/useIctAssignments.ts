'use client'

import { useMemo, useState } from 'react'
import { api, fetchAllPages } from '@/lib/api'
import { errorMessage } from '@/lib/errors'
import { fullName } from '@/lib/format'
import type { EnrollmentResponse } from '@/types/enrollment'
import { useApiQuery } from './useApiQuery'

export interface IctTrackRow {
  track: string
  mentees: number
  // User id of the ICT peer mentor chosen for this track, or ''
  mentorId: string
}

interface UseIctAssignmentsReturn {
  rows: IctTrackRow[]
  ictMentors: EnrollmentResponse[]
  menteeCount: number
  menteesWithTrack: number
  isLoading: boolean
  error: string | null
  refetch: () => void
  setMentor: (track: string, mentorUserId: string) => void
  changeCount: number
  save: () => Promise<{ saved: number; failed: string[] }>
  isSaving: boolean
}

// ICT peer mentors to tracks. An ICT peer mentor's enrollment holds one ict_track,
// so choosing a mentor for a track sets that track on their enrollment.
export function useIctAssignments(
  cohortId: string | null,
  tracksOffered: string[]
): UseIctAssignmentsReturn {
  const query = useApiQuery(
    async () => {
      const [mentees, ictMentors] = await Promise.all([
        fetchAllPages((page, page_size) =>
          api.cohorts.enrollments.list(cohortId as string, { page, page_size, role: 'mentee' })
        ),
        fetchAllPages((page, page_size) =>
          api.cohorts.enrollments.list(cohortId as string, {
            page,
            page_size,
            role: 'peer_mentor_ict',
          })
        ),
      ])
      return { mentees, ictMentors }
    },
    [cohortId],
    { enabled: cohortId !== null, fallbackError: "We couldn't load the ICT assignments." }
  )
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const savedMentorFor = (track: string) =>
    query.data?.ictMentors.find((m) => m.ict_track === track)?.user.id ?? ''

  const rows = useMemo<IctTrackRow[]>(
    () =>
      tracksOffered.map((track) => ({
        track,
        mentees: (query.data?.mentees ?? []).filter((m) => m.ict_track === track).length,
        mentorId: track in draft ? draft[track] : savedMentorFor(track),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tracksOffered, query.data, draft]
  )

  const setMentor = (track: string, mentorUserId: string) => {
    setDraft((d) => {
      const next = { ...d }
      if (mentorUserId === savedMentorFor(track)) delete next[track]
      else next[track] = mentorUserId
      // One track per ICT peer mentor: picking them here clears them elsewhere in the draft
      for (const other of tracksOffered) {
        if (
          other !== track &&
          mentorUserId &&
          (next[other] ?? savedMentorFor(other)) === mentorUserId
        ) {
          next[other] = ''
        }
      }
      return next
    })
  }

  const save = async () => {
    const data = query.data
    if (!data) return { saved: 0, failed: [] }
    // Work out each ICT peer mentor's final track from the whole table
    const finalTrack = new Map<string, string | null>()
    for (const row of rows) if (row.mentorId) finalTrack.set(row.mentorId, row.track)
    const updates = data.ictMentors
      .map((m) => ({ mentor: m, track: finalTrack.get(m.user.id) ?? null }))
      .filter(({ mentor, track }) => {
        // Leave mentors on tracks this cohort no longer offers alone
        if (track === null && mentor.ict_track && !tracksOffered.includes(mentor.ict_track))
          return false
        return (mentor.ict_track ?? null) !== track
      })
    setIsSaving(true)
    const results = await Promise.all(
      updates.map(async ({ mentor, track }) => {
        try {
          await api.cohorts.enrollments.update(cohortId as string, mentor.id, { ict_track: track })
          return null
        } catch (err: unknown) {
          return `${fullName(mentor.user)}: ${errorMessage(err, 'not saved')}`
        }
      })
    )
    setIsSaving(false)
    const failed = results.filter((r): r is string => r !== null)
    setDraft({})
    query.refetch()
    return { saved: updates.length - failed.length, failed }
  }

  const mentees = query.data?.mentees ?? []
  return {
    rows,
    ictMentors: [...(query.data?.ictMentors ?? [])].sort((a, b) =>
      fullName(a.user).localeCompare(fullName(b.user))
    ),
    menteeCount: mentees.length,
    menteesWithTrack: mentees.filter((m) => m.ict_track).length,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    setMentor,
    changeCount: Object.keys(draft).length,
    save,
    isSaving,
  }
}
