'use client'

import { useCallback, useMemo } from 'react'
import { api, fetchAllPages } from '@/lib/api'
import type {
  AttendanceStatus,
  OverrideRequestResponse,
  OverrideRequestStatus,
} from '@/types/attendance'
import { useApiQuery } from './useApiQuery'
import { useAsyncAction } from './useAsyncAction'
import { useMenteeDirectory } from './useMenteeDirectory'

export interface OverrideQueueItem {
  request: OverrideRequestResponse
  menteeName: string
  // The mentee's current record for the session, when one exists
  currentStatus: AttendanceStatus | null
}

interface UseOverrideQueueReturn {
  items: OverrideQueueItem[]
  pendingCount: number | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  approve: (requestId: string, newClosesAt: string, reason: string) => Promise<boolean>
  deny: (requestId: string, reason: string) => Promise<boolean>
  isReviewing: boolean
  reviewError: string | null
  clearReviewError: () => void
}

// Requests to reopen a closed attendance window, oldest first
export function useOverrideQueue(
  cohortId: string | null,
  status: OverrideRequestStatus
): UseOverrideQueueReturn {
  const directory = useMenteeDirectory(cohortId)

  const query = useApiQuery(
    async () => {
      const requests = await fetchAllPages((page, page_size) =>
        api.attendance.overrideRequests.list({
          page,
          page_size,
          cohort_id: cohortId as string,
          status,
        })
      )
      requests.sort((a, b) => a.created_at.localeCompare(b.created_at))
      // Current records only matter while a request is still waiting
      const statuses =
        status === 'pending'
          ? await Promise.all(
              requests.map((r) =>
                api.cohorts
                  .attendance(cohortId as string, {
                    session_id: r.session_id,
                    mentee_id: r.mentee_id,
                    page_size: 1,
                  })
                  .then((page) => page.items[0]?.status ?? null)
                  .catch(() => null)
              )
            )
          : requests.map(() => null)
      return requests.map((request, i) => ({ request, currentStatus: statuses[i] }))
    },
    [cohortId, status],
    { enabled: cohortId !== null, fallbackError: "We couldn't load the attendance queue." }
  )

  const pendingQuery = useApiQuery(
    () =>
      api.attendance.overrideRequests
        .list({ cohort_id: cohortId as string, status: 'pending', page_size: 1 })
        .then((page) => page.total),
    [cohortId],
    { enabled: cohortId !== null }
  )

  const items = useMemo(
    () =>
      (query.data ?? []).map((item) => ({
        ...item,
        menteeName: directory.nameFor(item.request.mentee_id),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query.data, directory.mentees]
  )

  const approveCall = useCallback(
    (id: string, newClosesAt: string, reason: string) =>
      api.attendance.overrideRequests.approve(id, {
        new_closes_at: newClosesAt,
        reason: reason || null,
      }),
    []
  )
  const denyCall = useCallback(
    (id: string, reason: string) => api.attendance.overrideRequests.deny(id, { reason }),
    []
  )
  const approveAction = useAsyncAction(approveCall, "The request wasn't approved. Try again.")
  const denyAction = useAsyncAction(denyCall, "The request wasn't denied. Try again.")

  const removeReviewed = (id: string) => {
    if (query.data) query.setData(query.data.filter((item) => item.request.id !== id))
    pendingQuery.refetch()
  }

  return {
    items,
    pendingCount: pendingQuery.data,
    isLoading: query.isLoading || directory.isLoading,
    error: query.error ?? directory.error,
    refetch: () => {
      query.refetch()
      pendingQuery.refetch()
      directory.refetch()
    },
    approve: async (id, newClosesAt, reason) => {
      denyAction.clearError()
      const ok = (await approveAction.run(id, newClosesAt, reason)) !== null
      if (ok) removeReviewed(id)
      return ok
    },
    deny: async (id, reason) => {
      approveAction.clearError()
      const ok = (await denyAction.run(id, reason)) !== null
      if (ok) removeReviewed(id)
      return ok
    },
    isReviewing: approveAction.isLoading || denyAction.isLoading,
    reviewError: approveAction.error ?? denyAction.error,
    clearReviewError: () => {
      approveAction.clearError()
      denyAction.clearError()
    },
  }
}
