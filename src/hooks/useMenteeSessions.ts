'use client'

import { api, fetchAllPages } from '@/lib/api'
import {
  loadOpenSessions,
  loadProgrammeMonth,
  monthLine,
  upcomingSession,
} from '@/lib/menteeSessions'
import type { MenteeSessionsData } from '@/types/menteeSessions'
import type { ParticipantCohort } from '@/types/participation'
import { useApiQuery, type ApiQuery } from './useApiQuery'

async function loadSessions(cohortId: string | null): Promise<MenteeSessionsData> {
  const overview = await api.dashboard.mentee.overview(cohortId ?? undefined)
  const [open, upcoming, month] = await Promise.all([
    loadOpenSessions(overview.cohort_id),
    fetchAllPages((page, page_size) =>
      api.sessions.list({
        page,
        page_size,
        cohort_id: overview.cohort_id,
        status: 'published',
        starts_after: new Date().toISOString(),
      })
    ),
    loadProgrammeMonth(overview),
  ])
  const now = new Date()
  return {
    monthLine: monthLine(month),
    open,
    upcoming: [...upcoming]
      .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
      .map((session) => upcomingSession(session, now)),
  }
}

// The active view's cohort. Peer mentors take part through the same screens.
export function useMenteeSessions({ cohortId }: ParticipantCohort): ApiQuery<MenteeSessionsData> {
  return useApiQuery(() => loadSessions(cohortId), [cohortId], {
    fallbackError: "We couldn't load your sessions. Try again.",
  })
}
