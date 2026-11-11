'use client'

import { useCallback, useMemo } from 'react'
import { api, fetchAllPages } from '@/lib/api'
import type { ActivityStatus, ActivityType, ExtraActivityResponse } from '@/types/activity'
import { useApiQuery } from './useApiQuery'
import { useAsyncAction } from './useAsyncAction'
import { useMenteeDirectory } from './useMenteeDirectory'

export interface ActivityRow {
  activity: ExtraActivityResponse
  menteeName: string
}

interface UseExtraActivitiesOptions {
  type: ActivityType | null
  status: ActivityStatus | null
  search: string
}

interface UseExtraActivitiesReturn {
  rows: ActivityRow[]
  isLoading: boolean
  error: string | null
  refetch: () => void
  reverse: (activityId: string, reason: string) => Promise<boolean>
  isReversing: boolean
  reverseError: string | null
  clearReverseError: () => void
}

// A cohort's extra activities, newest first, with mentee names and a name search
export function useExtraActivities(
  cohortId: string | null,
  { type, status, search }: UseExtraActivitiesOptions
): UseExtraActivitiesReturn {
  const directory = useMenteeDirectory(cohortId)
  const query = useApiQuery(
    () =>
      fetchAllPages((page, page_size) =>
        api.extraActivities.list({
          page,
          page_size,
          cohort_id: cohortId as string,
          type: type ?? undefined,
          status: status ?? undefined,
        })
      ),
    [cohortId, type, status],
    { enabled: cohortId !== null, fallbackError: "We couldn't load the extra activities." }
  )

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (query.data ?? [])
      .map((activity) => ({ activity, menteeName: directory.nameFor(activity.mentee_id) }))
      .filter((row) => !term || row.menteeName.toLowerCase().includes(term))
      .sort(
        (a, b) =>
          b.activity.date.localeCompare(a.activity.date) ||
          b.activity.created_at.localeCompare(a.activity.created_at)
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, directory.mentees, search])

  const reverseCall = useCallback(
    (id: string, reason: string) => api.extraActivities.reverse(id, { reason }),
    []
  )
  const reverseAction = useAsyncAction(reverseCall, "The activity wasn't reversed. Try again.")

  return {
    rows,
    isLoading: query.isLoading || directory.isLoading,
    error: query.error ?? directory.error,
    refetch: () => {
      query.refetch()
      directory.refetch()
    },
    reverse: async (id, reason) => {
      const updated = await reverseAction.run(id, reason)
      if (!updated || !query.data) return false
      query.setData(query.data.map((a) => (a.id === id ? updated : a)))
      return true
    },
    isReversing: reverseAction.isLoading,
    reverseError: reverseAction.error,
    clearReverseError: reverseAction.clearError,
  }
}
