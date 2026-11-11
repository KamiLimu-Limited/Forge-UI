'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { applicationView, isApplication } from '@/lib/menteeActivities'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import type {
  FinalOutcome,
  OpportunityApplicationResponse,
  OpportunityStage,
  ScholarshipApplicationResponse,
} from '@/types/activity'
import type { ApplicationView } from '@/types/menteeActivities'
import { useApiQuery } from './useApiQuery'
import { useAsyncAction } from './useAsyncAction'
import { useToast } from './useToast'

interface ApplicationChoice {
  stage: OpportunityStage
  finalOutcome: FinalOutcome
}

interface UseUpdateApplicationReturn {
  application: ApplicationView | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  stage: OpportunityStage
  setStage: (stage: OpportunityStage) => void
  finalOutcome: FinalOutcome
  setFinalOutcome: (outcome: FinalOutcome) => void
  save: () => Promise<void>
  isSaving: boolean
  saveError: string | null
}

// Stage and outcome changes recalculate the application's points on the server
export function useUpdateApplication(activityId: string): UseUpdateApplicationReturn {
  const router = useRouter()
  const { showToast } = useToast()
  const query = useApiQuery(
    async (): Promise<OpportunityApplicationResponse | ScholarshipApplicationResponse> => {
      const activity = await api.extraActivities.getById(activityId)
      if (!isApplication(activity)) throw new Error('Not an application')
      return activity
    },
    [activityId],
    { fallbackError: "We couldn't load this application. Try again." }
  )
  const [stage, setStage] = useState<OpportunityStage>('applied')
  const [finalOutcome, setFinalOutcome] = useState<FinalOutcome>('waiting_for_response')
  const activity = query.data

  useEffect(() => {
    if (!activity) return
    setStage(activity.details.stage ?? 'applied')
    setFinalOutcome(activity.details.final_outcome ?? 'waiting_for_response')
  }, [activity])

  const send = useCallback(
    (next: ApplicationChoice) => {
      if (!activity) return Promise.reject(new Error('Application not loaded'))
      return api.extraActivities.update(activityId, {
        details: { ...activity.details, stage: next.stage, final_outcome: next.finalOutcome },
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
    finalOutcome,
    setFinalOutcome,
    save: async () => {
      const saved = await action.run({ stage, finalOutcome })
      if (!saved) return
      showToast('Application updated', 'success')
      router.push(MENTEE_ROUTES.activities)
    },
    isSaving: action.isLoading,
    saveError: action.error,
  }
}
