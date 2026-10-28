'use client'

import { useMemo } from 'react'
import { api, fetchAllPages } from '@/lib/api'
import type { AdminUserListResponse } from '@/types/admin'
import { useApiQuery } from './useApiQuery'

export interface ProMentorRow {
  user: AdminUserListResponse
  sessionsAssigned: number
}

interface UseProMentorRosterReturn {
  mentors: ProMentorRow[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

// Professional mentors in a cohort, with how many of its sessions each is assigned to
export function useProMentorRoster(cohortId: string | null): UseProMentorRosterReturn {
  const query = useApiQuery(
    async () => {
      const [users, sessions] = await Promise.all([
        fetchAllPages((page, page_size) =>
          api.admin.users.list({
            page,
            page_size,
            role: 'professional_mentor',
            cohort_id: cohortId as string,
          })
        ),
        fetchAllPages((page, page_size) =>
          api.sessions.list({ page, page_size, cohort_id: cohortId as string })
        ),
      ])
      return { users, sessions }
    },
    [cohortId],
    { enabled: cohortId !== null, fallbackError: "We couldn't load the professional mentors." }
  )

  const mentors = useMemo(() => {
    const counts = new Map<string, number>()
    for (const s of query.data?.sessions ?? []) {
      if (s.status === 'cancelled') continue
      for (const m of s.mentors) counts.set(m.user.id, (counts.get(m.user.id) ?? 0) + 1)
    }
    return (query.data?.users ?? [])
      .map((user) => ({ user, sessionsAssigned: counts.get(user.id) ?? 0 }))
      .sort((a, b) => a.user.first_name.localeCompare(b.user.first_name))
  }, [query.data])

  return { mentors, isLoading: query.isLoading, error: query.error, refetch: query.refetch }
}
