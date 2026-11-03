'use client'

import { loadSessionDetail } from '@/lib/sessionRecord'
import type { SessionDetailView } from '@/types/menteeSessions'
import { useApiQuery, type ApiQuery } from './useApiQuery'

// One session as a mentee sees it. The admin screens use useSessionDetail.
export function useMenteeSessionDetail(sessionId: string): ApiQuery<SessionDetailView> {
  return useApiQuery(() => loadSessionDetail(sessionId), [sessionId], {
    fallbackError: "We couldn't load this session. Try again.",
  })
}
