'use client'

import { loadFacilitator, loadSessionRatings } from '@/lib/facilitator'
import type { FacilitatorView, SessionRatingsView } from '@/types/peerMentor'
import { useActiveView } from './useActiveView'
import { useApiQuery, type ApiQuery } from './useApiQuery'
import { useAuth } from './useAuth'

export function useFacilitator(): ApiQuery<FacilitatorView> {
  const { cohortId } = useActiveView()
  const { user } = useAuth()
  const userId = user?.id ?? ''
  return useApiQuery(() => loadFacilitator(cohortId, userId), [cohortId, userId], {
    enabled: userId !== '',
    fallbackError: "We couldn't load your sessions. Try again.",
  })
}

export function useSessionRatings(sessionId: string): ApiQuery<SessionRatingsView> {
  const { cohortId } = useActiveView()
  const { user } = useAuth()
  const userId = user?.id ?? ''
  return useApiQuery(
    () => loadSessionRatings(sessionId, cohortId, userId),
    [sessionId, cohortId, userId],
    {
      enabled: userId !== '',
      fallbackError: "We couldn't load this session's ratings. Try again.",
    }
  )
}
