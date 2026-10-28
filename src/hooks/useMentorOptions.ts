'use client'

import { useMemo } from 'react'
import { api, fetchAllPages } from '@/lib/api'
import { fullName } from '@/lib/format'
import { roleLabel } from '@/lib/roles'
import type { UserRole } from '@/types/auth'
import { useApiQuery } from './useApiQuery'

export interface MentorOption {
  id: string
  name: string
  email: string
  role: UserRole
  roleLabel: string
}

interface UseMentorOptionsReturn {
  mentors: MentorOption[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

const DEFAULT_ROLES: UserRole[] = ['professional_mentor', 'peer_mentor_ict', 'peer_mentor_1:1']

// People who can lead or co-mentor a session in a cohort, from GET /admin/users
export function useMentorOptions(
  cohortId: string | null,
  roles: UserRole[] = DEFAULT_ROLES
): UseMentorOptionsReturn {
  const roleKey = roles.join(',')
  const query = useApiQuery(
    async () => {
      const lists = await Promise.all(
        roles.map(async (role) => {
          const users = await fetchAllPages((page, page_size) =>
            api.admin.users.list({ page, page_size, role, cohort_id: cohortId ?? undefined })
          )
          return users.map((u) => ({ user: u, role }))
        })
      )
      return lists.flat()
    },
    [cohortId, roleKey],
    { enabled: cohortId !== null, fallbackError: "We couldn't load the mentors." }
  )

  const mentors = useMemo(() => {
    const seen = new Set<string>()
    const options: MentorOption[] = []
    for (const { user, role } of query.data ?? []) {
      if (seen.has(user.id) || user.account_state === 'suspended') continue
      seen.add(user.id)
      options.push({
        id: user.id,
        name: fullName(user),
        email: user.email,
        role,
        roleLabel: roleLabel(role),
      })
    }
    return options.sort((a, b) => a.name.localeCompare(b.name))
  }, [query.data])

  return { mentors, isLoading: query.isLoading, error: query.error, refetch: query.refetch }
}
