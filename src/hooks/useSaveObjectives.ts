'use client'

import { useCallback } from 'react'
import { api } from '@/lib/api'
import type { MenteeObjectivesData } from '@/types/menteeObjectives'
import { useAsyncAction } from './useAsyncAction'
import { useToast } from './useToast'

interface UseSaveObjectivesReturn {
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
      return api.skills.rate({ cohort_id: data.cohortId, rating_point: point, ratings })
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
