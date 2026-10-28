'use client'

import { useCallback } from 'react'
import { api } from '@/lib/api'
import type { AdminUserDetailResponse } from '@/types/admin'
import type { AccountState, UserRole } from '@/types/auth'
import { useApiQuery } from './useApiQuery'
import { useAsyncAction } from './useAsyncAction'

interface UseUsersDirectoryOptions {
  page: number
  pageSize: number
  search: string
  role: UserRole | null
  cohortId: string | null
  accountState: AccountState | null
}

interface UseUsersDirectoryReturn {
  users: AdminUserDetailResponse[]
  total: number
  isLoading: boolean
  error: string | null
  refetch: () => void
  reactivate: (userId: string) => Promise<boolean>
  suspend: (userId: string) => Promise<boolean>
  actionError: string | null
  clearActionError: () => void
  isActing: boolean
}

// One page of GET /admin/users. The list has no roles, so each row's detail is
// fetched too (see docs/api-gaps.md).
export function useUsersDirectory({
  page,
  pageSize,
  search,
  role,
  cohortId,
  accountState,
}: UseUsersDirectoryOptions): UseUsersDirectoryReturn {
  const query = useApiQuery(
    async () => {
      const list = await api.admin.users.list({
        page,
        page_size: pageSize,
        search: search.trim() || undefined,
        role: role ?? undefined,
        cohort_id: cohortId ?? undefined,
        account_state: accountState ?? undefined,
      })
      const users = await Promise.all(list.items.map((u) => api.admin.users.getById(u.id)))
      return { users, total: list.total }
    },
    [page, pageSize, search, role, cohortId, accountState],
    { fallbackError: "We couldn't load the users." }
  )

  const suspendCall = useCallback((id: string) => api.admin.users.suspend(id), [])
  const activateCall = useCallback((id: string) => api.admin.users.activate(id), [])
  const suspendAction = useAsyncAction(suspendCall, "The account wasn't suspended. Try again.")
  const activateAction = useAsyncAction(activateCall, "The account wasn't reactivated. Try again.")

  const setState = (id: string, state: AccountState) => {
    if (!query.data) return
    query.setData({
      ...query.data,
      users: query.data.users.map((u) => (u.id === id ? { ...u, account_state: state } : u)),
    })
  }

  return {
    users: query.data?.users ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    reactivate: async (id) => {
      const ok = (await activateAction.run(id)) !== null
      if (ok) setState(id, 'active')
      return ok
    },
    suspend: async (id) => {
      const ok = (await suspendAction.run(id)) !== null
      if (ok) setState(id, 'suspended')
      return ok
    },
    actionError: suspendAction.error ?? activateAction.error,
    clearActionError: () => {
      suspendAction.clearError()
      activateAction.clearError()
    },
    isActing: suspendAction.isLoading || activateAction.isLoading,
  }
}
