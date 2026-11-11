'use client'

import { useCallback } from 'react'
import { api } from '@/lib/api'
import type { MenteeObjectivesData } from '@/types/menteeObjectives'
import { useAsyncAction } from './useAsyncAction'
import { useToast } from './useToast'

interface UseSaveObjectivesReturn {
  // Objective id to its rating
  save: (ratings: Record<string, number>) => Promise<void>
  isSaving: boolean
  error: string | null
}

export function useSaveObjectives(
  data: MenteeObjectivesData | null,
  onSaved: () => void
): UseSaveObjectivesReturn {
  const { showToast } = useToast()
  const send = useCallback(
    (ratings: Record<string, number>) => {
      const point = data?.openWindow?.point
      if (!data || !point) return Promise.reject(new Error('No rating window is open'))
      // One rating per objective; any that fails fails the save, and the rest stay saved
      return Promise.all(
        Object.entries(ratings).map(([objectiveId, score]) =>
          api.objectives.rate(objectiveId, { rating_point: point, score })
        )
      )
    },
    [data]
  )
  const action = useAsyncAction(send, "We couldn't save your ratings. Try again.")

  return {
    save: async (ratings) => {
      const saved = await action.run(ratings)
      if (!saved) return
      showToast('Ratings saved', 'success')
      onSaved()
    },
    isSaving: action.isLoading,
    error: action.error,
  }
}
