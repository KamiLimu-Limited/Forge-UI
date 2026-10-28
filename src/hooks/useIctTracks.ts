'use client'

import { useCallback, useMemo, useState } from 'react'
import { api, fetchAllPages } from '@/lib/api'
import { errorMessage } from '@/lib/errors'
import type { EnrollmentResponse } from '@/types/enrollment'
import { useActiveCohort } from './useActiveCohort'
import { useApiQuery } from './useApiQuery'

export interface TrackSummary {
  name: string
  mentees: number
  peerMentors: EnrollmentResponse[]
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

// A cohort's ICT tracks (from ict_tracks_offered), who chose each one, and who hasn't
export function useIctTracks(cohortId: string | null): UseIctTracksReturn {
  const active = useActiveCohort()
  const query = useApiQuery(
    async () => {
      const [cohort, mentees, ictMentors] = await Promise.all([
        api.cohorts.getById(cohortId as string),
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
      return { offered: cohort.ict_tracks_offered ?? [], mentees, ictMentors }
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
    return data.offered.map((name) => ({
      name,
      mentees: data.mentees.filter((m) => m.ict_track === name).length,
      peerMentors: data.ictMentors.filter((m) => m.ict_track === name),
    }))
  }, [query.data])

  const setOffered = async (offered: string[]) => {
    const updated = await api.cohorts.update(cohortId as string, { ict_tracks_offered: offered })
    if (query.data) query.setData({ ...query.data, offered: updated.ict_tracks_offered ?? [] })
    active.refresh()
  }

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
        () => setOffered([...(query.data?.offered ?? []), name]),
        "The track wasn't added. Try again."
      ),
    removeTrack: (name) =>
      run(
        `track:${name}`,
        () => setOffered((query.data?.offered ?? []).filter((t) => t !== name)),
        "The track wasn't removed. Try again."
      ),
    setMenteeTrack: (enrollmentId, track) =>
      run(
        enrollmentId,
        async () => {
          const updated = await api.cohorts.enrollments.update(cohortId as string, enrollmentId, {
            ict_track: track,
          })
          if (query.data) {
            query.setData({
              ...query.data,
              mentees: query.data.mentees.map((m) => (m.id === enrollmentId ? updated : m)),
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
