'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { applicationView } from '@/lib/menteeActivities'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import type { OpportunityApplicationResponse, OpportunityOutcome } from '@/types/activity'
import type { ApplicationView } from '@/types/menteeActivities'
import { useApiQuery } from './useApiQuery'
import { useAsyncAction } from './useAsyncAction'
import { useToast } from './useToast'

interface UseUpdateApplicationReturn {
  application: ApplicationView | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  stage: OpportunityOutcome
  setStage: (stage: OpportunityOutcome) => void
  save: () => Promise<void>
  isSaving: boolean
  saveError: string | null
}

export function useUpdateApplication(activityId: string): UseUpdateApplicationReturn {
  const router = useRouter()
  const { showToast } = useToast()
  const query = useApiQuery(
    async (): Promise<OpportunityApplicationResponse> => {
      const activity = await api.extraActivities.getById(activityId)
      if (activity.type !== 'opportunity') throw new Error('Not an application')
      return activity
    },
    [activityId],
    { fallbackError: "We couldn't load this application. Try again." }
  )
  const [stage, setStage] = useState<OpportunityOutcome>('applied')
  const activity = query.data

  useEffect(() => {
    if (activity) setStage(activity.details.outcome_status)
  }, [activity])

  const send = useCallback(
    (next: OpportunityOutcome) => {
      if (!activity) return Promise.reject(new Error('Application not loaded'))
      return api.extraActivities.update(activityId, {
        details: { ...activity.details, outcome_status: next },
      })
    },
    [activity, activityId]
  )
  const action = useAsyncAction(send, "We couldn't save your changes. Try again.")

  return {
    application: activity ? applicationView(activity) : null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    stage,
    setStage,
    save: async () => {
      const saved = await action.run(stage)
      if (!saved) return
      showToast('Application updated', 'success')
      router.push(MENTEE_ROUTES.activities)
    },
    isSaving: action.isLoading,
    saveError: action.error,
  }
}
