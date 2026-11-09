'use client'

import { api, fetchAllPages } from '@/lib/api'
import { historyRows, loadProgrammeMonth, monthLine } from '@/lib/menteeSessions'
import type { MenteeHistoryData } from '@/types/menteeSessions'
import { loadPeerHistory } from '@/lib/peerParticipation'
import type { ParticipantCohort } from '@/types/participation'
import { useApiQuery, type ApiQuery } from './useApiQuery'

async function loadHistory(activeCohortId: string | null): Promise<MenteeHistoryData> {
  const overview = await api.dashboard.mentee.overview(activeCohortId ?? undefined)
  const cohortId = overview.cohort_id
  const [entries, records, sessions, month] = await Promise.all([
    api.dashboard.mentee.history(cohortId),
    fetchAllPages((page, page_size) =>
      api.attendance.mine({ page, page_size, cohort_id: cohortId })
    ),
    // Only adds end times and materials, so history still shows without it
    fetchAllPages((page, page_size) =>
      api.sessions.list({ page, page_size, cohort_id: cohortId })
    ).catch(() => []),
    loadProgrammeMonth(overview),
  ])
  return { monthLine: monthLine(month), rows: historyRows(entries, records, sessions) }
}

// The active view's cohort. Peer mentors take part through the same screens.
export function useMenteeHistory({
  cohortId,
  peerCohortId,
}: ParticipantCohort): ApiQuery<MenteeHistoryData> {
  return useApiQuery(
    () => (peerCohortId ? loadPeerHistory(peerCohortId) : loadHistory(cohortId)),
    [cohortId, peerCohortId],
    {
      fallbackError: "We couldn't load your session history. Try again.",
    }
  )
}
