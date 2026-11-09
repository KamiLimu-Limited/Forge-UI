'use client'

import { api } from '@/lib/api'
import { objectivesData } from '@/lib/menteeObjectives'
import type { MenteeObjectivesData } from '@/types/menteeObjectives'
import { loadPeerObjectives } from '@/lib/peerParticipation'
import type { ParticipantCohort } from '@/types/participation'
import { useApiQuery, type ApiQuery } from './useApiQuery'

async function loadObjectives(activeCohortId: string | null): Promise<MenteeObjectivesData> {
  const overview = await api.dashboard.mentee.overview(activeCohortId ?? undefined)
  const cohortId = overview.cohort_id
  const [progress, windows] = await Promise.all([
    api.skills.progress(overview.points.mentee_id, cohortId),
    api.skills.windows(cohortId),
  ])
  return objectivesData(cohortId, progress, windows)
}

// The active view's cohort. Peer mentors take part through the same screens.
export function useMenteeObjectives({
  cohortId,
  peerCohortId,
}: ParticipantCohort): ApiQuery<MenteeObjectivesData> {
  return useApiQuery(
    () => (peerCohortId ? loadPeerObjectives(peerCohortId) : loadObjectives(cohortId)),
    [cohortId, peerCohortId],
    {
      fallbackError: "We couldn't load your objectives. Try again.",
    }
  )
}
