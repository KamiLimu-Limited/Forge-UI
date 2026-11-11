'use client'

import { useCallback } from 'react'
import { api } from '@/lib/api'
import { useActiveCohort } from './useActiveCohort'
import { useAsyncAction } from './useAsyncAction'
import { useToast } from './useToast'

interface UseArchiveCohortReturn {
  // Only a closed or imported cohort can be archived, and only once
  canArchive: boolean
  isArchived: boolean
  archive: () => Promise<boolean>
  isArchiving: boolean
  error: string | null
}

export function useArchiveCohort(cohortId: string): UseArchiveCohortReturn {
  const { cohorts, refresh } = useActiveCohort()
  const { showToast } = useToast()
  const cohort = cohorts.find((item) => item.id === cohortId) ?? null
  const action = useAsyncAction(
    useCallback(() => api.cohorts.archive(cohortId), [cohortId]),
    "The cohort wasn't archived. Try again."
  )
  const isArchived = cohort?.status === 'archived'
  return {
    canArchive: cohort !== null && !isArchived && (cohort.closed_at !== null || cohort.is_imported),
    isArchived,
    archive: async () => {
      const archived = await action.run()
      if (!archived) return false
      showToast(`${archived.name} is archived.`, 'success')
      refresh()
      return true
    },
    isArchiving: action.isLoading,
    error: action.error,
  }
}
