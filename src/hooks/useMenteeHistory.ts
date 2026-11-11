'use client'

import { api, fetchAllPages } from '@/lib/api'
import { historyRows, loadHistoryNotes, loadProgrammeMonth, monthLine } from '@/lib/menteeSessions'
import type { MenteeHistoryData } from '@/types/menteeSessions'
import type { ParticipantCohort } from '@/types/participation'
import { useApiQuery, type ApiQuery } from './useApiQuery'

async function loadHistory(activeCohortId: string | null): Promise<MenteeHistoryData> {
  const overview = await api.dashboard.mentee.overview(activeCohortId ?? undefined)
  const cohortId = overview.cohort_id
  const [entries, records, sessions, month, questions] = await Promise.all([
    api.dashboard.mentee.history(cohortId),
    fetchAllPages((page, page_size) =>
      api.attendance.mine({ page, page_size, cohort_id: cohortId })
    ),
    // Only adds end times and materials, so history still shows without it
    fetchAllPages((page, page_size) =>
      api.sessions.list({ page, page_size, cohort_id: cohortId })
    ).catch(() => []),
    loadProgrammeMonth(overview),
    // Only labels the ratings, so history still shows without it
    api.cohorts.ratingQuestions(cohortId).catch(() => []),
  ])
  const notes = await loadHistoryNotes(
    entries.filter((entry) => entry.outcome !== 'remaining').map((entry) => entry.session_id)
  )
  return {
    monthLine: monthLine(month),
    rows: historyRows(entries, records, sessions, questions, notes),
  }
}

// The active view's cohort. Peer mentors take part through the same screens.
export function useMenteeHistory({ cohortId }: ParticipantCohort): ApiQuery<MenteeHistoryData> {
  return useApiQuery(() => loadHistory(cohortId), [cohortId], {
    fallbackError: "We couldn't load your session history. Try again.",
  })
}
