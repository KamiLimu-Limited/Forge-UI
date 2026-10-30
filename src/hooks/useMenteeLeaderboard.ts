'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import type { DimensionEntry, LeaderboardDimension } from '@/types/leaderboard'
import { useApiQuery } from './useApiQuery'

interface UseMenteeLeaderboardReturn {
  dimension: LeaderboardDimension
  setDimension: (dimension: LeaderboardDimension) => void
  entries: DimensionEntry[] | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

// One board at a time. A chip press loads only that board.
export function useMenteeLeaderboard(): UseMenteeLeaderboardReturn {
  const [dimension, setDimension] = useState<LeaderboardDimension>('core_attendance')
  const cohort = useApiQuery(
    () => api.dashboard.mentee.overview().then((overview) => overview.cohort_id),
    [],
    { fallbackError: "We couldn't load the leaderboard. Try again." }
  )
  const cohortId = cohort.data
  const board = useApiQuery(
    () =>
      api.leaderboard.dimension(cohortId as string, dimension).then((response) => response.entries),
    [cohortId, dimension],
    { enabled: cohortId !== null, fallbackError: "We couldn't load the leaderboard. Try again." }
  )

  return {
    dimension,
    setDimension,
    entries: board.data,
    isLoading: cohort.isLoading || board.isLoading,
    error: cohort.error ?? board.error,
    refetch: () => {
      cohort.refetch()
      board.refetch()
    },
  }
}
