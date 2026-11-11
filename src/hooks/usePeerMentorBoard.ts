'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import type { PeerMentorDimension, PeerMentorRow } from '@/types/leaderboard'
import { useApiQuery } from './useApiQuery'

interface UsePeerMentorBoardReturn {
  rankedBy: PeerMentorDimension
  setRankedBy: (dimension: PeerMentorDimension) => void
  entries: PeerMentorRow[] | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function usePeerMentorBoard(cohortId: string | null): UsePeerMentorBoardReturn {
  const [rankedBy, setRankedBy] = useState<PeerMentorDimension>('sessions_attended')
  const query = useApiQuery(
    async () => (await api.leaderboard.peerMentors(cohortId as string, rankedBy)).entries,
    [cohortId, rankedBy],
    { enabled: cohortId !== null, fallbackError: "We couldn't load the leaderboard. Try again." }
  )
  return {
    rankedBy,
    setRankedBy,
    entries: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
