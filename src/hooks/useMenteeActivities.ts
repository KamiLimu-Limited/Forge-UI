'use client'

import { api, fetchAllPages } from '@/lib/api'
import { activitiesData } from '@/lib/menteeActivities'
import type { MenteeActivitiesData } from '@/types/menteeActivities'
import { loadPeerActivities } from '@/lib/peerParticipation'
import { useApiQuery, type ApiQuery } from './useApiQuery'

async function loadActivities(): Promise<MenteeActivitiesData> {
  const overview = await api.dashboard.mentee.overview()
  const activities = await fetchAllPages((page, page_size) =>
    api.extraActivities.mine({ page, page_size, cohort_id: overview.cohort_id })
  )
  return activitiesData(activities)
}

// Peer mentors take part through the same screens, loaded from their group's cohort
export function useMenteeActivities(isPeerMentor = false): ApiQuery<MenteeActivitiesData> {
  return useApiQuery(isPeerMentor ? () => loadPeerActivities() : loadActivities, [isPeerMentor], {
    fallbackError: "We couldn't load your activities. Try again.",
  })
}
