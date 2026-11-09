'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { ChooseTrackView } from '@/types/ictTrackSelection'
import { useActiveView } from './useActiveView'
import { useApiQuery } from './useApiQuery'
import { useAuth } from './useAuth'

interface UseChooseTrackReturn {
  data: ChooseTrackView | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  selected: string | null
  setSelected: (track: string) => void
  // Saving needs PUT /cohorts/{id}/ict-track-selection/me, which doesn't exist yet
  canSave: boolean
}

async function loadChooseTrack(
  activeCohortId: string | null,
  userId: string
): Promise<ChooseTrackView> {
  const cohortId: string =
    activeCohortId ?? (await api.dashboard.mentee.overview()).cohort_id
  const [cohort, enrollments] = await Promise.all([
    api.cohorts.getById(cohortId),
    api.cohorts.enrollments.list(cohortId, { role: 'mentee', page_size: 100 }).catch(() => null),
  ])
  const mine = enrollments?.items.find((item) => item.user.id === userId)
  return {
    tracks: (cohort.ict_tracks_offered ?? []).map((name) => ({
      name,
      description: null,
      leadMentorName: null,
    })),
    currentTrack: mine?.ict_track ?? null,
    closesOn: null,
  }
}

// The cohort's ICT tracks and the mentee's current one. The choice is kept here so it is
// ready to send once the API can save it. See docs/api-gaps.md (M4).
export function useChooseTrack(): UseChooseTrackReturn {
  const { cohortId } = useActiveView()
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const query = useApiQuery(() => loadChooseTrack(cohortId, userId), [cohortId, userId], {
    enabled: userId !== '',
    fallbackError: "We couldn't load the ICT tracks. Try again.",
  })
  const [selected, setSelected] = useState<string | null>(null)
  const currentTrack = query.data?.currentTrack ?? null

  useEffect(() => {
    if (currentTrack) setSelected(currentTrack)
  }, [currentTrack])

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    selected,
    setSelected,
    canSave: false,
  }
}
