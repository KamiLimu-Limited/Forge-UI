'use client'

import { api, fetchAllPages } from '@/lib/api'
import { historyRows, loadProgrammeMonth, monthLine } from '@/lib/menteeSessions'
import type { MenteeHistoryData } from '@/types/menteeSessions'
import { loadPeerHistory } from '@/lib/peerParticipation'
import { useApiQuery, type ApiQuery } from './useApiQuery'

async function loadHistory(): Promise<MenteeHistoryData> {
  const overview = await api.dashboard.mentee.overview()
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

// Peer mentors take part through the same screens, loaded from their role's cohort
export function useMenteeHistory(peerCohortId: string | null = null): ApiQuery<MenteeHistoryData> {
  return useApiQuery(
    peerCohortId ? () => loadPeerHistory(peerCohortId) : loadHistory,
    [peerCohortId],
    {
      fallbackError: "We couldn't load your session history. Try again.",
    }
  )
}
