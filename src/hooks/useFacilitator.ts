'use client'

import { loadFacilitator, loadSessionRatings } from '@/lib/facilitator'
import type { FacilitatorView, SessionRatingsView } from '@/types/peerMentor'
import { useActiveView } from './useActiveView'
import { useApiQuery, type ApiQuery } from './useApiQuery'

export function useFacilitator(): ApiQuery<FacilitatorView> {
  const { cohortId } = useActiveView()
  return useApiQuery(() => loadFacilitator(cohortId), [cohortId], {
    fallbackError: "We couldn't load your sessions. Try again.",
  })
}

export function useSessionRatings(sessionId: string): ApiQuery<SessionRatingsView> {
  const { cohortId } = useActiveView()
  return useApiQuery(() => loadSessionRatings(sessionId, cohortId), [sessionId, cohortId], {
    fallbackError: "We couldn't load this session's ratings. Try again.",
  })
}
