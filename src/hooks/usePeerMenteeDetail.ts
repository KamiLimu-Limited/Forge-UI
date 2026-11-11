'use client'

import { api, fetchAllPages } from '@/lib/api'
import { menteeDetail } from '@/lib/peerMentor'
import type { MenteeDetailView } from '@/types/peerMentor'
import { useApiQuery, type ApiQuery } from './useApiQuery'

async function loadDetail(menteeId: string): Promise<MenteeDetailView> {
  // The drill-down is the core of the page. The other two can each be missing.
  const drilldown = await api.peerMentor.mentee(menteeId)
  const [records, questions] = await Promise.all([
    fetchAllPages((page, page_size) =>
      api.peerMentor.groupAttendance({ page, page_size, mentee_id: menteeId })
    ).catch(() => null),
    api.cohorts.ratingQuestions(drilldown.points.cohort_id).catch(() => []),
  ])
  return menteeDetail(drilldown, records, questions)
}

export function usePeerMenteeDetail(menteeId: string): ApiQuery<MenteeDetailView> {
  return useApiQuery(() => loadDetail(menteeId), [menteeId], {
    fallbackError: "We couldn't load this mentee. Try again.",
  })
}
