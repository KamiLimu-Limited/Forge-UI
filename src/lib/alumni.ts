// =============================================================================
// An alumnus's past cohort record, from the mentee routes pointed at that cohort.
// Each part loads on its own, so one refused route only blanks its own card.
// =============================================================================

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

export async function loadAlumniHome(
  userId: string,
  firstName: string,
  cohortId: string
): Promise<AlumniHomeView> {
  const cohort = await api.cohorts.getById(cohortId)
  const [overview, rates, status] = await Promise.allSettled([
    api.dashboard.mentee.overview(cohortId),
    api.mentees.attendanceRates(userId, cohortId),
    api.mentees.finalStatus(userId, cohortId),
  ])
  const points = settled(overview)?.points ?? null
  const final = settled(status)
  return {
    firstName,
    cohortName: cohort.name,
    graduated: final !== null && final.is_final && final.status === 'graduated',
    graduatedOn: cohort.end_date,
    coreRate: settled(rates)?.core_rate ?? null,
    overallRate: settled(rates)?.combined_rate ?? null,
    totalPoints: points?.total_points ?? null,
    sessionsAttended: points?.sessions_attended ?? null,
  }
}

export async function loadAlumniRecord(
  userId: string,
  cohortId: string
): Promise<AlumniRecordView> {
  const cohort = await api.cohorts.getById(cohortId)
  const [history, records, activities, progress] = await Promise.allSettled([
    api.dashboard.mentee.history(cohortId),
    fetchAllPages((page, page_size) =>
      api.attendance.mine({ page, page_size, cohort_id: cohortId })
    ),
    fetchAllPages((page, page_size) =>
      api.extraActivities.mine({ page, page_size, cohort_id: cohortId })
    ),
    api.skills.progress(userId, cohortId),
  ])
  const entries = settled(history)
  const pillarFor = new Map(
    (entries ?? []).map((entry) => [entry.session_id, sessionPillar(entry)])
  )
  const logged = settled(activities)
  const skills = settled(progress)
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
            .filter((activity) => activity.status !== 'rejected')
            .map((activity) => activity.type)
        )
      : null,
    objectives: skills ? objectiveRows(skills) : null,
  }
}
