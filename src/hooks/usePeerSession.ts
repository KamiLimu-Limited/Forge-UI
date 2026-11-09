'use client'

import { loadPeerSession } from '@/lib/peerMentor'
import type { PeerSessionView } from '@/types/peerMentor'
import { useActiveView } from './useActiveView'
import { useApiQuery, type ApiQuery } from './useApiQuery'

export function usePeerSession(): ApiQuery<PeerSessionView | null> {
  const { cohortId } = useActiveView()
  return useApiQuery(() => loadPeerSession(cohortId), [cohortId], {
    fallbackError: "We couldn't load your peer mentorship session. Try again.",
  })
}
