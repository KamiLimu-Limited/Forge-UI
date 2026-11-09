'use client'

import { api, fetchAllPages } from '@/lib/api'
import { menteeDetail } from '@/lib/peerMentor'
import type { MenteeDetailView } from '@/types/peerMentor'
import { useApiQuery, type ApiQuery } from './useApiQuery'

async function loadDetail(menteeId: string): Promise<MenteeDetailView> {
  // The drill-down is the core of the page. The other two can each be missing.
  const drilldown = await api.peerMentor.mentee(menteeId)
  const [progress, records] = await Promise.all([
    api.skills.progress(menteeId, drilldown.points.cohort_id).catch(() => null),
    fetchAllPages((page, page_size) =>
      api.peerMentor.groupAttendance({ page, page_size, mentee_id: menteeId })
    ).catch(() => null),
  ])
  return menteeDetail(drilldown, progress, records)
}

export function usePeerMenteeDetail(menteeId: string): ApiQuery<MenteeDetailView> {
  return useApiQuery(() => loadDetail(menteeId), [menteeId], {
    fallbackError: "We couldn't load this mentee. Try again.",
  })
}
