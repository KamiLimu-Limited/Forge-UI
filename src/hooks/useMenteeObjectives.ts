'use client'

import { api } from '@/lib/api'
import { objectivesData } from '@/lib/menteeObjectives'
import type { MenteeObjectivesData } from '@/types/menteeObjectives'
import { loadPeerObjectives } from '@/lib/peerParticipation'
import { useApiQuery, type ApiQuery } from './useApiQuery'

async function loadObjectives(): Promise<MenteeObjectivesData> {
  const overview = await api.dashboard.mentee.overview()
  const cohortId = overview.cohort_id
  const [progress, windows] = await Promise.all([
    api.skills.progress(overview.points.mentee_id, cohortId),
    api.skills.windows(cohortId),
  ])
  return objectivesData(cohortId, progress, windows)
}

// Peer mentors take part through the same screens, loaded from their role's cohort
export function useMenteeObjectives(
  peerCohortId: string | null = null
): ApiQuery<MenteeObjectivesData> {
  return useApiQuery(
    peerCohortId ? () => loadPeerObjectives(peerCohortId) : loadObjectives,
    [peerCohortId],
    {
      fallbackError: "We couldn't load your objectives. Try again.",
    }
  )
}
