'use client'

import { api } from '@/lib/api'
import { monthRows, RANK_BOARDS, rankFor, sessionBuckets } from '@/lib/menteeDashboard'
import { loadOpenSessions, loadProgrammeMonth } from '@/lib/menteeSessions'
import { sessionPillar } from '@/lib/sessions'
import type { MenteeHomeData, NextSession } from '@/types/home'
import type { SessionBrief } from '@/types/session'
import { useActiveView } from './useActiveView'
import { useApiQuery, type ApiQuery } from './useApiQuery'

// The value, or null if the request failed, so one missing part can't hide the page
function settled<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === 'fulfilled' ? result.value : null
}

async function loadNextSession(brief: SessionBrief | null): Promise<NextSession | null> {
  if (!brief) return null
  const detail = await api.sessions.getById(brief.id).catch(() => null)
  return {
    id: brief.id,
    title: brief.title,
    startsAt: brief.starts_at,
    endsAt: detail?.ends_at ?? null,
    pillar: sessionPillar(brief),
    materialsUrl: detail?.resources[0]?.url ?? null,
  }
}

async function loadHome(
  userId: string,
  firstName: string,
  activeCohortId: string | null
): Promise<MenteeHomeData> {
  // The overview is the core of the page. Everything else can be missing.
  const overview = await api.dashboard.mentee.overview(activeCohortId ?? undefined)
  const cohortId = overview.cohort_id

  const [rates, month, enrollments, nextSession, openSessions, future, ...boards] =
    await Promise.allSettled([
      api.mentees.attendanceRates(overview.points.mentee_id, cohortId),
      loadProgrammeMonth(overview),
      api.cohorts.enrollments.list(cohortId, { role: 'mentee', page_size: 100 }),
      loadNextSession(overview.next_session),
      loadOpenSessions(cohortId),
      api.sessions.list({
        cohort_id: cohortId,
        status: 'published',
        starts_after: new Date().toISOString(),
        page_size: 1,
      }),
      ...RANK_BOARDS.map((board) => api.leaderboard.dimension(cohortId, board.dimension)),
    ])

  const { programmeMonth, totalMonths } = settled(month) ?? {
    programmeMonth: null,
    totalMonths: null,
  }
  // With no sessions due the API still reports 100%, which would claim attendance
  // the mentee doesn't have, so both the rate and the attendance rank wait for data
  const hasSessions = overview.points.sessions_due > 0
  const attendanceRates = settled(rates)
  const enrollmentPage = settled(enrollments)
  const enrollment = enrollmentPage?.items.find((item) => item.user.id === userId)

  return {
    firstName,
    programmeMonth,
    totalMonths,
    // The API has no name for the peer mentor yet. See docs/api-gaps.md.
    peerMentorName: null,
    // If the enrollment couldn't be read, don't tell the mentee nobody is assigned
    hasPeerMentor: enrollment ? enrollment.peer_mentor_id !== null : true,
    // There is no API for choosing a track yet. See docs/api-gaps.md.
    trackPrompt: null,
    standing: {
      coreRate: hasSessions ? (attendanceRates?.core_rate ?? null) : null,
      overallRate: hasSessions
        ? (attendanceRates?.combined_rate ?? overview.graduation.combined_rate)
        : null,
      // Extra activity points count too, as in the overall rate
      pointsEarned: overview.points.total_points,
      pointsPossible: overview.points.core_points_available,
    },
    buckets: sessionBuckets(
      overview.points,
      overview.open_attendance_windows,
      settled(future)?.total ?? 0
    ),
    nextSession: settled(nextSession),
    openSessions: settled(openSessions) ?? [],
    months: monthRows(attendanceRates?.by_month ?? [], programmeMonth),
    ranks: RANK_BOARDS.map((board, index) =>
      rankFor(
        board.label,
        board.dimension === 'core_attendance' && !hasSessions ? null : settled(boards[index])
      )
    ),
  }
}

export function useMenteeHome(userId: string, firstName: string): ApiQuery<MenteeHomeData> {
  const { cohortId } = useActiveView()
  return useApiQuery(() => loadHome(userId, firstName, cohortId), [userId, cohortId], {
    fallbackError: "We couldn't load your home. Try again.",
  })
}
