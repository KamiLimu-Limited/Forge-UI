'use client'

import { api } from '@/lib/api'
import { objectivesData } from '@/lib/menteeObjectives'
import type { MenteeObjectivesData } from '@/types/menteeObjectives'
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

export function useMenteeObjectives(): ApiQuery<MenteeObjectivesData> {
  return useApiQuery(loadObjectives, [], {
    fallbackError: "We couldn't load your objectives. Try again.",
  })
}
