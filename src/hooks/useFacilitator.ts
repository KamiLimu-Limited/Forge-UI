'use client'

import { loadFacilitator, loadSessionRatings } from '@/lib/facilitator'
import type { FacilitatorView, SessionRatingsView } from '@/types/peerMentor'
import { useApiQuery, type ApiQuery } from './useApiQuery'

export function useFacilitator(): ApiQuery<FacilitatorView> {
  return useApiQuery(() => loadFacilitator(), [], {
    fallbackError: "We couldn't load your sessions. Try again.",
  })
}

export function useSessionRatings(sessionId: string): ApiQuery<SessionRatingsView> {
  return useApiQuery(() => loadSessionRatings(sessionId), [sessionId], {
    fallbackError: "We couldn't load this session's ratings. Try again.",
  })
}
