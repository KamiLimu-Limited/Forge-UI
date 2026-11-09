'use client'

import { api, fetchAllPages } from '@/lib/api'
import { activitiesData } from '@/lib/menteeActivities'
import type { MenteeActivitiesData } from '@/types/menteeActivities'
import { loadPeerActivities } from '@/lib/peerParticipation'
import type { ParticipantCohort } from '@/types/participation'
import { useApiQuery, type ApiQuery } from './useApiQuery'

async function loadActivities(cohortId: string | null): Promise<MenteeActivitiesData> {
  const overview = await api.dashboard.mentee.overview(cohortId ?? undefined)
  const activities = await fetchAllPages((page, page_size) =>
    api.extraActivities.mine({ page, page_size, cohort_id: overview.cohort_id })
  )
  return activitiesData(activities)
}

// The active view's cohort. Peer mentors take part through the same screens.
export function useMenteeActivities({
  cohortId,
  peerCohortId,
}: ParticipantCohort): ApiQuery<MenteeActivitiesData> {
  return useApiQuery(
    () => (peerCohortId ? loadPeerActivities(peerCohortId) : loadActivities(cohortId)),
    [cohortId, peerCohortId],
    {
      fallbackError: "We couldn't load your activities. Try again.",
    }
  )
}
