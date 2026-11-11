'use client'

import { useCallback, useMemo, useState } from 'react'
import { api, fetchAllPages } from '@/lib/api'
import { errorMessage } from '@/lib/errors'
import type { IctTrackEntry, IctTrackResponse } from '@/types/cohort'
import type { EnrollmentResponse } from '@/types/enrollment'
import { useActiveCohort } from './useActiveCohort'
import { useApiQuery } from './useApiQuery'

export interface TrackSummary {
  name: string
  mentees: number
  // The API's lead_mentor, which holds the track's ICT peer mentor
  peerMentors: EnrollmentResponse[]
}

function entryOf(track: IctTrackResponse): IctTrackEntry {
  return {
    name: track.name,
    description: track.description,
    lead_mentor_id: track.lead_mentor?.id ?? null,
  }
}

interface UseIctTracksReturn {
  tracks: TrackSummary[]
  mentees: EnrollmentResponse[]
  withoutTrack: EnrollmentResponse[]
  isLoading: boolean
  error: string | null
  refetch: () => void
  addTrack: (name: string) => Promise<boolean>
  removeTrack: (name: string) => Promise<boolean>
  setMenteeTrack: (enrollmentId: string, track: string) => Promise<boolean>
  // The track or enrollment a write is running for
  busyKey: string | null
  actionError: string | null
  clearActionError: () => void
}

// A cohort's ICT tracks, who chose each one, and who hasn't
export function useIctTracks(cohortId: string | null): UseIctTracksReturn {
  const active = useActiveCohort()
  const query = useApiQuery(
    async () => {
      const [offered, mentees, ictMentors] = await Promise.all([
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
      return { offered, mentees, ictMentors }
    },
    [cohortId],
    { enabled: cohortId !== null, fallbackError: "We couldn't load the ICT tracks." }
  )
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const run = useCallback(async (key: string, call: () => Promise<void>, fallback: string) => {
    setBusyKey(key)
    setActionError(null)
    try {
      await call()
      return true
    } catch (err: unknown) {
      setActionError(errorMessage(err, fallback))
      return false
    } finally {
      setBusyKey(null)
    }
  }, [])

  const tracks = useMemo<TrackSummary[]>(() => {
    const data = query.data
    if (!data) return []
    return data.offered.map((track) => ({
      name: track.name,
      mentees: data.mentees.filter((m) => m.ict_track === track.name).length,
      peerMentors: data.ictMentors.filter((m) => m.user.id === track.lead_mentor?.id),
    }))
  }, [query.data])

  const setOffered = async (tracks: IctTrackEntry[]) => {
    const updated = await api.cohorts.setIctTracks(cohortId as string, { tracks })
    if (query.data) query.setData({ ...query.data, offered: updated })
    active.refresh()
  }
  const offeredEntries = (query.data?.offered ?? []).map(entryOf)

  return {
    tracks,
    mentees: query.data?.mentees ?? [],
    withoutTrack: (query.data?.mentees ?? []).filter((m) => !m.ict_track),
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    addTrack: (name) =>
      run(
        `track:${name}`,
        () => setOffered([...offeredEntries, { name }]),
        "The track wasn't added. Try again."
      ),
    removeTrack: (name) =>
      run(
        `track:${name}`,
        () => setOffered(offeredEntries.filter((track) => track.name !== name)),
        "The track wasn't removed. Try again."
      ),
    setMenteeTrack: (enrollmentId, track) =>
      run(
        enrollmentId,
        async () => {
          const enrollment = query.data?.mentees.find((m) => m.id === enrollmentId)
          if (!enrollment) throw new Error('Mentee not found')
          const updated = await api.cohorts.overrideTrack(cohortId as string, enrollment.user.id, {
            ict_track: track,
          })
          if (query.data) {
            query.setData({
              ...query.data,
              mentees: query.data.mentees.map((m) =>
                m.id === enrollmentId ? { ...m, ict_track: updated.ict_track } : m
              ),
            })
          }
        },
        "The track wasn't set. Try again."
      ),
    busyKey,
    actionError,
    clearActionError: () => setActionError(null),
  }
}
