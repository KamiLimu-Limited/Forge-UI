'use client'

import { api } from '@/lib/api'
import { objectivesData } from '@/lib/menteeObjectives'
import type { MenteeObjectivesData } from '@/types/menteeObjectives'
import type { ParticipantCohort } from '@/types/participation'
import { useApiQuery, type ApiQuery } from './useApiQuery'

async function loadObjectives(activeCohortId: string | null): Promise<MenteeObjectivesData> {
  const overview = await api.dashboard.mentee.overview(activeCohortId ?? undefined)
  const cohortId = overview.cohort_id
  const [objectives, windows] = await Promise.all([
    api.objectives.mine(cohortId),
    api.objectives.windows(cohortId),
  ])
  return objectivesData(cohortId, objectives, windows.windows)
}

// The active view's cohort. Peer mentors take part through the same screens.
export function useMenteeObjectives({
  cohortId,
}: ParticipantCohort): ApiQuery<MenteeObjectivesData> {
  return useApiQuery(() => loadObjectives(cohortId), [cohortId], {
    fallbackError: "We couldn't load your objectives. Try again.",
  })
}
