'use client'

import { useMemo, useState } from 'react'
import { api, fetchAllPages } from '@/lib/api'
import { errorMessage } from '@/lib/errors'
import { fullName } from '@/lib/format'
import type { IctTrackResponse } from '@/types/cohort'
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
  trackCount: number
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

// ICT peer mentors to tracks. The API keeps one person per track in `lead_mentor`, who must be
// an ICT peer mentor in the cohort, so that field holds the track's ICT peer mentor. The
// track's lead mentor is someone else and has no field yet (docs/api-gaps.md, gap 20). All
// tracks save together, since the API replaces the whole list.
export function useIctAssignments(cohortId: string | null): UseIctAssignmentsReturn {
  const query = useApiQuery(
    async () => {
      const [tracks, mentees, ictMentors] = await Promise.all([
        api.cohorts.ictTracks(cohortId as string),
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
      return { tracks, mentees, ictMentors }
    },
    [cohortId],
    { enabled: cohortId !== null, fallbackError: "We couldn't load the ICT assignments." }
  )
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const tracks: IctTrackResponse[] = useMemo(() => query.data?.tracks ?? [], [query.data])
  const tracksOffered = tracks.map((track) => track.name)
  const savedMentorFor = (name: string) =>
    tracks.find((track) => track.name === name)?.lead_mentor?.id ?? ''

  const rows = useMemo<IctTrackRow[]>(
    () =>
      tracks.map((track) => ({
        track: track.name,
        mentees: (query.data?.mentees ?? []).filter((m) => m.ict_track === track.name).length,
        mentorId: track.name in draft ? draft[track.name] : (track.lead_mentor?.id ?? ''),
      })),
    [tracks, query.data, draft]
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
    const changed = Object.keys(draft).length
    if (!query.data || changed === 0) return { saved: 0, failed: [] }
    setIsSaving(true)
    try {
      await api.cohorts.setIctTracks(cohortId as string, {
        tracks: tracks.map((track) => {
          const mentorId = track.name in draft ? draft[track.name] : track.lead_mentor?.id
          return {
            name: track.name,
            description: track.description,
            lead_mentor_id: mentorId || null,
          }
        }),
      })
      setDraft({})
      query.refetch()
      return { saved: changed, failed: [] }
    } catch (err: unknown) {
      return { saved: 0, failed: [errorMessage(err, 'The assignments were not saved')] }
    } finally {
      setIsSaving(false)
    }
  }

  const mentees = query.data?.mentees ?? []
  return {
    rows,
    trackCount: tracks.length,
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
