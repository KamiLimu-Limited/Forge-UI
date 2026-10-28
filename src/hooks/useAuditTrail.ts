'use client'

import { useMemo } from 'react'
import { api, fetchAllPages } from '@/lib/api'
import { fullName } from '@/lib/format'
import type { AuditLogResponse } from '@/types/audit'
import { useApiQuery } from './useApiQuery'

interface UseAuditTrailOptions {
  page: number
  pageSize: number
  userId: string | null
  resourceType: string | null
  // YYYY-MM-DD, from the start of that day
  since: string | null
}

export interface PersonOption {
  id: string
  name: string
}

interface UseAuditTrailReturn {
  logs: AuditLogResponse[]
  total: number
  isLoading: boolean
  error: string | null
  refetch: () => void
  // Admins and committee members, the people who make admin changes
  people: PersonOption[]
}

export function useAuditTrail({
  page,
  pageSize,
  userId,
  resourceType,
  since,
}: UseAuditTrailOptions): UseAuditTrailReturn {
  const query = useApiQuery(
    () =>
      api.admin.auditLogs.list({
        page,
        page_size: pageSize,
        user_id: userId ?? undefined,
        resource_type: resourceType ?? undefined,
        since: since ? new Date(`${since}T00:00:00`).toISOString() : undefined,
      }),
    [page, pageSize, userId, resourceType, since],
    { fallbackError: "We couldn't load the audit trail." }
  )

  const peopleQuery = useApiQuery(
    async () => {
      const lists = await Promise.all(
        (['admin', 'committee'] as const).map((role) =>
          fetchAllPages((p, page_size) => api.admin.users.list({ page: p, page_size, role }))
        )
      )
      const extra =
        userId && !lists.flat().some((u) => u.id === userId)
          ? [await api.admin.users.getById(userId).catch(() => null)]
          : []
      return [...lists.flat(), ...extra.filter((u) => u !== null)]
    },
    [userId],
    {}
  )

  const people = useMemo(() => {
    const seen = new Map<string, string>()
    for (const u of peopleQuery.data ?? []) seen.set(u.id, fullName(u) || u.email)
    return Array.from(seen, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }, [peopleQuery.data])

  return {
    logs: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    people,
  }
}
