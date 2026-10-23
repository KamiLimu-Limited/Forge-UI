'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { ApiError } from '@/types/auth'
import type { AccountState } from '@/types/auth'
import type { AdminUserListResponse, PaginatedResponse } from '@/types/admin'

interface UseAdminUsersOptions {
  page: number
  pageSize: number
  accountState: AccountState | null
}

interface UseAdminUsersReturn {
  users: AdminUserListResponse[]
  total: number
  totalPages: number
  isLoading: boolean
  error: string | null
  refetch: () => void
  suspend: (userId: string) => Promise<void>
  activate: (userId: string) => Promise<void>
  actionError: string | null
  clearActionError: () => void
}

export function useAdminUsers({ page, pageSize, accountState }: UseAdminUsersOptions): UseAdminUsersReturn {
  const [data, setData] = useState<PaginatedResponse<AdminUserListResponse> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    api.admin.users
      .list({ page, page_size: pageSize, account_state: accountState ?? undefined })
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load users')
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [page, pageSize, accountState, tick])

  const suspend = useCallback(async (userId: string) => {
    try {
      await api.admin.users.suspend(userId)
      refetch()
    } catch (err: unknown) {
      setActionError(err instanceof ApiError ? err.message : 'Failed to suspend user')
    }
  }, [refetch])

  const activate = useCallback(async (userId: string) => {
    try {
      await api.admin.users.activate(userId)
      refetch()
    } catch (err: unknown) {
      setActionError(err instanceof ApiError ? err.message : 'Failed to reactivate user')
    }
  }, [refetch])

  return {
    users: data?.items ?? [],
    total: data?.total ?? 0,
    totalPages: data?.total_pages ?? 0,
    isLoading,
    error,
    refetch,
    suspend,
    activate,
    actionError,
    clearActionError: () => setActionError(null),
  }
}
