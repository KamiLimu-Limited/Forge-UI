// An alumnus's past cohort: the frozen result from /alumni/me/history, and the session,
// activity and objective record from the mentee routes pointed at that cohort. Each part
// loads on its own, so one refused route only blanks its own card.

import { api, fetchAllPages } from '@/lib/api'
import { activityCounts, attendanceRows, objectiveRows } from '@/lib/peerMentor'
import { sessionPillar } from '@/lib/sessions'
import type { AlumniHomeView, AlumniRecordView } from '@/types/alumni'
import type { UserProfileResponse } from '@/types/auth'

// The cohort of the newest alumni role
export function alumniCohortId(user: UserProfileResponse | null): string | null {
  const newest = [...(user?.roles ?? [])]
    .filter((item) => item.role === 'alumni')
    .sort((a, b) => b.assigned_at.localeCompare(a.assigned_at))[0]
  return newest?.cohort_id ?? null
}

function settled<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === 'fulfilled' ? result.value : null
}

export async function loadAlumniHome(firstName: string, cohortId: string): Promise<AlumniHomeView> {
  const history = await api.users.alumniHistory()
  const entry = history.find((item) => item.cohort.id === cohortId) ?? null
  const [cohort, card, overview] = await Promise.allSettled([
    entry ? Promise.resolve(entry.cohort) : api.cohorts.getById(cohortId),
    // Graduates only, so a refusal just means no date
    api.users.graduationCard(),
    api.dashboard.mentee.overview(cohortId),
  ])
  const result = entry?.result ?? null
  const graduationCard = settled(card)
  return {
    firstName,
    cohortName: settled(cohort)?.name ?? '',
    graduated: result?.graduated ?? false,
    graduatedOn: graduationCard?.cohort.id === cohortId ? graduationCard.graduated_on : null,
    coreRate: result?.core_rate ?? null,
    overallRate: result?.overall_rate ?? null,
    totalPoints: result?.total_points ?? null,
    sessionsAttended: settled(overview)?.points.sessions_attended ?? null,
  }
}

export async function loadAlumniRecord(cohortId: string): Promise<AlumniRecordView> {
  const cohort = await api.cohorts.getById(cohortId)
  const [history, records, activities, progress] = await Promise.allSettled([
    api.dashboard.mentee.history(cohortId),
    fetchAllPages((page, page_size) =>
      api.attendance.mine({ page, page_size, cohort_id: cohortId })
    ),
    fetchAllPages((page, page_size) =>
      api.extraActivities.mine({ page, page_size, cohort_id: cohortId })
    ),
    api.objectives.mine(cohortId),
  ])
  const entries = settled(history)
  const pillarFor = new Map(
    (entries ?? []).map((entry) => [entry.session_id, sessionPillar(entry)])
  )
  const logged = settled(activities)
  const objectives = settled(progress)
  return {
    cohortName: cohort.name,
    sessions: entries
      ? attendanceRows(entries, settled(records) ?? []).map((row) => ({
          ...row,
          pillar: pillarFor.get(row.sessionId) ?? null,
        }))
      : null,
    activities: logged
      ? activityCounts(
          logged
            .filter((activity) => activity.status !== 'reversed')
            .map((activity) => activity.type)
        )
      : null,
    objectives: objectives ? objectiveRows(objectives) : null,
  }
}
