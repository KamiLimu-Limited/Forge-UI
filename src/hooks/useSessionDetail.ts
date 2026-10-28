'use client'

import { useCallback } from 'react'
import { api } from '@/lib/api'
import type { SessionDetailResponse } from '@/types/session'
import { useApiQuery } from './useApiQuery'
import { useAsyncAction } from './useAsyncAction'

interface UseSessionDetailReturn {
  session: SessionDetailResponse | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  setSession: (session: SessionDetailResponse) => void
  cancel: (reason: string) => Promise<boolean>
  isCancelling: boolean
  cancelError: string | null
  clearCancelError: () => void
}

// One session from GET /sessions/{id}, plus cancelling it with DELETE
export function useSessionDetail(sessionId: string): UseSessionDetailReturn {
  const query = useApiQuery(() => api.sessions.getById(sessionId), [sessionId], {
    fallbackError: "We couldn't load this session.",
  })

  const cancelCall = useCallback(
    (reason: string) => api.sessions.cancel(sessionId, { reason }).then(() => true),
    [sessionId]
  )
  const cancelAction = useAsyncAction(cancelCall, "The session wasn't cancelled. Try again.")

  return {
    session: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    setSession: query.setData,
    cancel: async (reason) => (await cancelAction.run(reason)) === true,
    isCancelling: cancelAction.isLoading,
    cancelError: cancelAction.error,
    clearCancelError: cancelAction.clearError,
  }
}
