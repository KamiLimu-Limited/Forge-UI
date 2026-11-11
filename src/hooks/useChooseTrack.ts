'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { toDateOnly } from '@/lib/format'
import type { ChooseTrackView } from '@/types/ictTrackSelection'
import { useActiveView } from './useActiveView'
import { useApiQuery } from './useApiQuery'
import { useAsyncAction } from './useAsyncAction'
import { useToast } from './useToast'

interface UseChooseTrackReturn {
  data: ChooseTrackView | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  selected: string | null
  setSelected: (track: string) => void
  // Only while the selection window is open
  canSave: boolean
  save: () => Promise<void>
  isSaving: boolean
  saveError: string | null
}

async function loadChooseTrack(activeCohortId: string | null): Promise<ChooseTrackView> {
  const cohortId: string = activeCohortId ?? (await api.dashboard.mentee.overview()).cohort_id
  const [tracks, selection] = await Promise.all([
    api.cohorts.ictTracks(cohortId),
    api.cohorts.trackSelection(cohortId),
  ])
  return {
    cohortId,
    tracks: tracks.map((track) => ({
      name: track.name,
      description: track.description,
      // The API's lead_mentor is the track's ICT peer mentor, not its lead mentor (gap 20)
      leadMentorName: null,
    })),
    currentTrack: selection.ict_track,
    isOpen: selection.window.is_open,
    opensOn: selection.window.opens_at ? toDateOnly(selection.window.opens_at) : null,
    closesOn: selection.window.closes_at ? toDateOnly(selection.window.closes_at) : null,
  }
}

// The cohort's ICT tracks, the selection window and the mentee's choice, which they can
// change until the window closes
export function useChooseTrack(): UseChooseTrackReturn {
  const { cohortId } = useActiveView()
  const { showToast } = useToast()
  const query = useApiQuery(() => loadChooseTrack(cohortId), [cohortId], {
    fallbackError: "We couldn't load the ICT tracks. Try again.",
  })
  const [selected, setSelected] = useState<string | null>(null)
  const currentTrack = query.data?.currentTrack ?? null

  useEffect(() => {
    if (currentTrack) setSelected(currentTrack)
  }, [currentTrack])

  const send = useCallback(
    (track: string) => {
      if (!query.data) return Promise.reject(new Error('Tracks not loaded'))
      return api.cohorts.chooseTrack(query.data.cohortId, track)
    },
    [query.data]
  )
  const action = useAsyncAction(send, "We couldn't save your track. Try again.")

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    selected,
    setSelected,
    canSave: query.data?.isOpen ?? false,
    save: async () => {
      if (!selected) return
      const saved = await action.run(selected)
      if (!saved || !query.data) return
      query.setData({ ...query.data, currentTrack: saved.ict_track })
      showToast(`${saved.ict_track ?? selected} saved as your ICT track.`, 'success')
    },
    isSaving: action.isLoading,
    saveError: action.error,
  }
}
