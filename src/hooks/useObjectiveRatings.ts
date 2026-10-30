'use client'

import { useEffect, useState } from 'react'
import type { MenteeObjectivesData } from '@/types/menteeObjectives'

interface UseObjectiveRatingsReturn {
  ratings: Record<string, number>
  setRating: (skill: string, value: number) => void
  // Turns on the per-objective messages after a failed save
  showErrors: boolean
  // True when every objective has a rating; otherwise shows what's missing
  check: () => boolean
}

// The ratings for the open window. Earlier answers load in, since saving again replaces them.
export function useObjectiveRatings(data: MenteeObjectivesData | null): UseObjectiveRatingsReturn {
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [showErrors, setShowErrors] = useState(false)

  useEffect(() => {
    const point = data?.openWindow?.point
    if (!data || !point) return
    const saved: Record<string, number> = {}
    for (const objective of data.objectives) {
      const score = objective.scores[point]
      if (score !== null) saved[objective.skill] = score
    }
    setRatings(saved)
  }, [data])

  return {
    ratings,
    setRating: (skill, value) => setRatings((current) => ({ ...current, [skill]: value })),
    showErrors,
    check: () => {
      const isComplete = (data?.objectives ?? []).every(
        (objective) => ratings[objective.skill] !== undefined
      )
      setShowErrors(!isComplete)
      return isComplete
    },
  }
}
