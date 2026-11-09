'use client'

import { api } from '@/lib/api'
import type { MeetSessionView } from '@/types/adminIntegrations'
import { useApiQuery, type ApiQuery } from './useApiQuery'

// The session whose Meet participants are being matched
export function useMeetSession(sessionId: string): ApiQuery<MeetSessionView> {
  return useApiQuery(
    () =>
      api.sessions
        .getById(sessionId)
        .then((session) => ({ id: session.id, title: session.title, startsAt: session.starts_at })),
    [sessionId],
    { fallbackError: "We couldn't load this session. Try again." }
  )
}
