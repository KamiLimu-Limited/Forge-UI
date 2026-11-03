'use client'

import { api, fetchAllPages } from '@/lib/api'
import {
  loadOpenSessions,
  loadProgrammeMonth,
  monthLine,
  upcomingSession,
} from '@/lib/menteeSessions'
import type { MenteeSessionsData } from '@/types/menteeSessions'
import { loadPeerSessions } from '@/lib/peerParticipation'
import { useApiQuery, type ApiQuery } from './useApiQuery'

async function loadSessions(): Promise<MenteeSessionsData> {
  const overview = await api.dashboard.mentee.overview()
  const cohortId = overview.cohort_id
  const [open, upcoming, month] = await Promise.all([
    loadOpenSessions(cohortId),
    fetchAllPages((page, page_size) =>
      api.sessions.list({
        page,
        page_size,
        cohort_id: cohortId,
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

// Peer mentors take part through the same screens, loaded from their group's cohort
export function useMenteeSessions(isPeerMentor = false): ApiQuery<MenteeSessionsData> {
  return useApiQuery(isPeerMentor ? () => loadPeerSessions() : loadSessions, [isPeerMentor], {
    fallbackError: "We couldn't load your sessions. Try again.",
  })
}
