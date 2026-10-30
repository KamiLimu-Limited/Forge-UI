'use client'

import { api, fetchAllPages } from '@/lib/api'
import { activitiesData } from '@/lib/menteeActivities'
import type { MenteeActivitiesData } from '@/types/menteeActivities'
import { useApiQuery, type ApiQuery } from './useApiQuery'

async function loadActivities(): Promise<MenteeActivitiesData> {
  const overview = await api.dashboard.mentee.overview()
  const activities = await fetchAllPages((page, page_size) =>
    api.extraActivities.mine({ page, page_size, cohort_id: overview.cohort_id })
  )
  return activitiesData(activities)
}

export function useMenteeActivities(): ApiQuery<MenteeActivitiesData> {
  return useApiQuery(loadActivities, [], {
    fallbackError: "We couldn't load your activities. Try again.",
  })
}
