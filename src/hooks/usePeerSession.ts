'use client'

import { loadPeerSession } from '@/lib/peerMentor'
import type { PeerSessionView } from '@/types/peerMentor'
import { useApiQuery, type ApiQuery } from './useApiQuery'

export function usePeerSession(): ApiQuery<PeerSessionView | null> {
  return useApiQuery(() => loadPeerSession(), [], {
    fallbackError: "We couldn't load your peer mentorship session. Try again.",
  })
}
