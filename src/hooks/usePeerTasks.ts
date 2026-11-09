'use client'

import { useEffect, useState } from 'react'
import {
  loadGroupMeetings,
  loadPeerTaskForm,
  loadPeerTasks,
  taskDraftErrors,
} from '@/lib/peerTasks'
import type { GroupMeetingsView } from '@/types/adminIntegrations'
import type { PeerTaskDraft, PeerTaskFormView, PeerTasksView } from '@/types/peerTasks'
import { useApiQuery } from './useApiQuery'
import type { CohortQuery } from './useCommittee'
import { useOversightCohort } from './useOversightCohort'

function requireCohort(cohortId: string | null): string {
  if (!cohortId) throw new Error('No cohort')
  return cohortId
}

export function usePeerTasks(): CohortQuery<PeerTasksView> {
  const { cohortId, isLoading } = useOversightCohort()
  const query = useApiQuery(() => loadPeerTasks(requireCohort(cohortId)), [cohortId], {
    enabled: cohortId !== null,
    fallbackError: "We couldn't load the peer mentorship tasks. Try again.",
  })
  return { ...query, isLoading: isLoading || query.isLoading, hasCohort: cohortId !== null }
}

interface UsePeerTaskFormReturn {
  form: PeerTaskFormView | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  draft: PeerTaskDraft | null
  setDraft: (changes: Partial<PeerTaskDraft>) => void
  errors: Partial<Record<keyof PeerTaskDraft, string>>
  // Saving waits for a Program Delivery Lead permission in the API (see docs/api-gaps.md)
  canSave: boolean
  check: () => void
}

// The task form. It fills in and checks itself, but never sends: no save can work yet.
export function usePeerTaskForm(sessionId: string | null): UsePeerTaskFormReturn {
  const { cohortId } = useOversightCohort()
  const query = useApiQuery(
    () => loadPeerTaskForm(requireCohort(cohortId), sessionId),
    [cohortId, sessionId],
    { enabled: cohortId !== null, fallbackError: "We couldn't load this task. Try again." }
  )
  const [draft, setDraftState] = useState<PeerTaskDraft | null>(null)
  const [errors, setErrors] = useState<UsePeerTaskFormReturn['errors']>({})

  useEffect(() => {
    if (query.data) setDraftState(query.data.initial)
  }, [query.data])

  return {
    form: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    draft,
    setDraft: (changes) => {
      setDraftState((current) => (current ? { ...current, ...changes } : current))
      setErrors({})
    },
    errors,
    canSave: false,
    check: () => {
      if (draft) setErrors(taskDraftErrors(draft))
    },
  }
}

export interface UseGroupMeetingsReturn extends CohortQuery<GroupMeetingsView> {
  setTaskId: (id: string) => void
}

export function useGroupMeetings(): UseGroupMeetingsReturn {
  const { cohortId, isLoading } = useOversightCohort()
  const [taskId, setTaskId] = useState<string | null>(null)
  const query = useApiQuery(
    () => loadGroupMeetings(requireCohort(cohortId), taskId),
    [cohortId, taskId],
    { enabled: cohortId !== null, fallbackError: "We couldn't load the group meetings. Try again." }
  )
  return {
    ...query,
    isLoading: isLoading || query.isLoading,
    hasCohort: cohortId !== null,
    setTaskId,
  }
}
