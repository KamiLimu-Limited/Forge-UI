'use client'

import { api, fetchAllPages } from '@/lib/api'
import { currentWeek } from '@/lib/format'
import type { AuditLogResponse } from '@/types/audit'
import type { SessionResponse } from '@/types/session'
import { useApiQuery, type ApiQuery } from './useApiQuery'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const COMING_UP_COUNT = 4

interface UseAdminOverviewReturn {
  pendingOverrides: ApiQuery<number>
  sessionsThisWeek: ApiQuery<number>
  menteesWithoutTrack: ApiQuery<number>
  activitiesThisWeek: ApiQuery<number>
  comingUp: ApiQuery<SessionResponse[]>
  recentChanges: ApiQuery<AuditLogResponse[]>
}

// The numbers and lists on the admin overview. Each loads on its own so one
// failure doesn't hide the rest.
export function useAdminOverview(cohortId: string | null): UseAdminOverviewReturn {
  const enabled = cohortId !== null
  const id = cohortId as string

  const pendingOverrides = useApiQuery(
    () => api.dashboard.cohortHealth(id).then((h) => h.pending_override_requests),
    [cohortId],
    { enabled, fallbackError: "Couldn't load this number." }
  )

  const sessionsThisWeek = useApiQuery(
    async () => {
      const { start, end } = currentWeek()
      const sessions = await fetchAllPages((page, page_size) =>
        api.sessions.list({
          page,
          page_size,
          cohort_id: id,
          starts_after: start.toISOString(),
          starts_before: end.toISOString(),
        })
      )
      return sessions.filter((s) => s.status !== 'cancelled').length
    },
    [cohortId],
    { enabled, fallbackError: "Couldn't load this number." }
  )

  const menteesWithoutTrack = useApiQuery(
    async () => {
      const mentees = await fetchAllPages((page, page_size) =>
        api.cohorts.enrollments.list(id, { page, page_size, role: 'mentee' })
      )
      return mentees.filter((m) => !m.ict_track).length
    },
    [cohortId],
    { enabled, fallbackError: "Couldn't load this number." }
  )

  const activitiesThisWeek = useApiQuery(
    async () => {
      const since = Date.now() - WEEK_MS
      const activities = await fetchAllPages((page, page_size) =>
        api.extraActivities.list({ page, page_size, cohort_id: id })
      )
      return activities.filter((a) => new Date(a.created_at).getTime() >= since).length
    },
    [cohortId],
    { enabled, fallbackError: "Couldn't load this number." }
  )

  const comingUp = useApiQuery(
    async () => {
      const page = await api.sessions.list({
        cohort_id: id,
        starts_after: new Date().toISOString(),
        page_size: 20,
      })
      return page.items.filter((s) => s.status !== 'cancelled').slice(0, COMING_UP_COUNT)
    },
    [cohortId],
    { enabled, fallbackError: "We couldn't load the upcoming sessions." }
  )

  const recentChanges = useApiQuery(
    () => api.admin.auditLogs.list({ page_size: 5 }).then((p) => p.items),
    [],
    { fallbackError: "We couldn't load the recent changes." }
  )

  return {
    pendingOverrides,
    sessionsThisWeek,
    menteesWithoutTrack,
    activitiesThisWeek,
    comingUp,
    recentChanges,
  }
}
