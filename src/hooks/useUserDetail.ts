'use client'

import { useCallback, useMemo } from 'react'
import { api, fetchAllPages } from '@/lib/api'
import type { AdminUserDetailResponse, AdminUserUpdateRequest } from '@/types/admin'
import type { UserRole } from '@/types/auth'
import type { EnrollmentResponse, EnrollmentUpdateRequest } from '@/types/enrollment'
import { useApiQuery } from './useApiQuery'
import { useAsyncAction } from './useAsyncAction'

interface UseUserDetailReturn {
  user: AdminUserDetailResponse | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  update: (body: AdminUserUpdateRequest) => Promise<boolean>
  updateError: string | null
  isUpdating: boolean
  clearUpdateError: () => void
  addRole: (role: UserRole, cohortId: string | null) => Promise<boolean>
  removeRole: (assignmentId: string) => Promise<boolean>
  roleError: string | null
  isChangingRoles: boolean
  clearRoleError: () => void
  setSuspended: (suspended: boolean) => Promise<boolean>
  accountError: string | null
  isChangingAccount: boolean
  clearAccountError: () => void
}

// GET /admin/users/{id} with edit, role and suspend actions
export function useUserDetail(userId: string): UseUserDetailReturn {
  const query = useApiQuery(() => api.admin.users.getById(userId), [userId], {
    fallbackError: "We couldn't load this user.",
  })

  const updateCall = useCallback(
    (body: AdminUserUpdateRequest) => api.admin.users.update(userId, body),
    [userId]
  )
  const addRoleCall = useCallback(
    (role: UserRole, cohortId: string | null) =>
      api.admin.users.addRole(userId, { role, cohort_id: cohortId }),
    [userId]
  )
  const removeRoleCall = useCallback(
    (assignmentId: string) => api.admin.users.removeRole(userId, assignmentId).then(() => true),
    [userId]
  )
  const accountCall = useCallback(
    (suspend: boolean) =>
      suspend ? api.admin.users.suspend(userId) : api.admin.users.activate(userId),
    [userId]
  )

  const updateAction = useAsyncAction(updateCall, "The details weren't saved. Try again.")
  const addRoleAction = useAsyncAction(addRoleCall, "The role wasn't added. Try again.")
  const removeRoleAction = useAsyncAction(removeRoleCall, "The role wasn't removed. Try again.")
  const accountAction = useAsyncAction(accountCall, "The account wasn't changed. Try again.")

  return {
    user: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    update: async (body) => {
      const updated = await updateAction.run(body)
      if (updated) query.setData(updated)
      return updated !== null
    },
    updateError: updateAction.error,
    isUpdating: updateAction.isLoading,
    clearUpdateError: updateAction.clearError,
    addRole: async (role, cohortId) => {
      removeRoleAction.clearError()
      const ok = (await addRoleAction.run(role, cohortId)) !== null
      if (ok) query.refetch()
      return ok
    },
    removeRole: async (assignmentId) => {
      addRoleAction.clearError()
      const ok = (await removeRoleAction.run(assignmentId)) !== null
      if (ok) query.refetch()
      return ok
    },
    roleError: addRoleAction.error ?? removeRoleAction.error,
    isChangingRoles: addRoleAction.isLoading || removeRoleAction.isLoading,
    clearRoleError: () => {
      addRoleAction.clearError()
      removeRoleAction.clearError()
    },
    setSuspended: async (suspend) => {
      const ok = (await accountAction.run(suspend)) !== null
      if (ok && query.data) {
        query.setData({ ...query.data, account_state: suspend ? 'suspended' : 'active' })
      }
      return ok
    },
    accountError: accountAction.error,
    isChangingAccount: accountAction.isLoading,
    clearAccountError: accountAction.clearError,
  }
}

interface UseUserEnrollmentReturn {
  enrollment: EnrollmentResponse | null
  peerMentors: EnrollmentResponse[]
  isLoading: boolean
  error: string | null
  refetch: () => void
  save: (body: EnrollmentUpdateRequest) => Promise<boolean>
  isSaving: boolean
  saveError: string | null
}

// The user's mentee enrollment in a cohort, plus the cohort's 1:1 peer mentors
export function useUserEnrollment(
  cohortId: string | null,
  userId: string
): UseUserEnrollmentReturn {
  const query = useApiQuery(
    async () => {
      const [mentees, peerMentors] = await Promise.all([
        fetchAllPages((page, page_size) =>
          api.cohorts.enrollments.list(cohortId as string, { page, page_size, role: 'mentee' })
        ),
        fetchAllPages((page, page_size) =>
          api.cohorts.enrollments.list(cohortId as string, {
            page,
            page_size,
            role: 'peer_mentor_1:1',
          })
        ),
      ])
      return { enrollment: mentees.find((e) => e.user.id === userId) ?? null, peerMentors }
    },
    [cohortId, userId],
    { enabled: cohortId !== null, fallbackError: "We couldn't load this user's assignments." }
  )

  const enrollmentId = query.data?.enrollment?.id ?? null
  const saveCall = useCallback(
    (body: EnrollmentUpdateRequest) =>
      api.cohorts.enrollments.update(cohortId as string, enrollmentId as string, body),
    [cohortId, enrollmentId]
  )
  const saveAction = useAsyncAction(saveCall, "The assignments weren't saved. Try again.")

  const peerMentors = useMemo(
    () =>
      [...(query.data?.peerMentors ?? [])].sort((a, b) =>
        a.user.first_name.localeCompare(b.user.first_name)
      ),
    [query.data]
  )

  return {
    enrollment: query.data?.enrollment ?? null,
    peerMentors,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    save: async (body) => {
      const updated = await saveAction.run(body)
      if (updated && query.data) query.setData({ ...query.data, enrollment: updated })
      return updated !== null
    },
    isSaving: saveAction.isLoading,
    saveError: saveAction.error,
  }
}
