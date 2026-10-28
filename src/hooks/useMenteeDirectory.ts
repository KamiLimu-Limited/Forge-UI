'use client'

import { useMemo } from 'react'
import { api, fetchAllPages } from '@/lib/api'
import { fullName } from '@/lib/format'
import type { EnrollmentResponse } from '@/types/enrollment'
import { useApiQuery } from './useApiQuery'

interface UseMenteeDirectoryReturn {
  mentees: EnrollmentResponse[]
  // Mentee name by user id. Records from the API carry only mentee_id.
  nameFor: (userId: string) => string
  isLoading: boolean
  error: string | null
  refetch: () => void
}

// Every mentee enrolled in a cohort, from GET /cohorts/{id}/enrollments?role=mentee
export function useMenteeDirectory(cohortId: string | null): UseMenteeDirectoryReturn {
  const query = useApiQuery(
    () =>
      fetchAllPages((page, page_size) =>
        api.cohorts.enrollments.list(cohortId as string, { page, page_size, role: 'mentee' })
      ),
    [cohortId],
    { enabled: cohortId !== null, fallbackError: "We couldn't load the mentees." }
  )

  const names = useMemo(() => {
    const map = new Map<string, string>()
    for (const e of query.data ?? []) map.set(e.user.id, fullName(e.user) || e.user.email)
    return map
  }, [query.data])

  return {
    mentees: query.data ?? [],
    nameFor: (userId) => names.get(userId) ?? 'A participant no longer enrolled',
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
