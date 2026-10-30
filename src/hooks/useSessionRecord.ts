'use client'

import { loadSessionRecord } from '@/lib/sessionRecord'
import type { SessionRecordView } from '@/types/menteeSessions'
import { useApiQuery, type ApiQuery } from './useApiQuery'

export function useSessionRecord(sessionId: string): ApiQuery<SessionRecordView> {
  return useApiQuery(() => loadSessionRecord(sessionId), [sessionId], {
    fallbackError: "We couldn't load this session. Try again.",
  })
}
