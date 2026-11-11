'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DELIVERY_LEAD_ROUTES } from '@/lib/committeeRoutes'
import {
  loadGroupMeetings,
  loadPeerTaskForm,
  loadPeerTasks,
  savePeerTask,
  taskDraftErrors,
} from '@/lib/peerTasks'
import type { GroupMeetingsView } from '@/types/adminIntegrations'
import type { PeerTaskDraft, PeerTaskFormView, PeerTasksView } from '@/types/peerTasks'
import { useApiQuery } from './useApiQuery'
import { useAsyncAction } from './useAsyncAction'
import type { CohortQuery } from './useCommittee'
import { useToast } from './useToast'
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
  save: () => Promise<void>
  isSaving: boolean
  saveError: string | null
}

// The task form for the Program Delivery Lead, the System Admin and the Program Lead
export function usePeerTaskForm(sessionId: string | null): UsePeerTaskFormReturn {
  const { cohortId } = useOversightCohort()
  const router = useRouter()
  const { showToast } = useToast()
  const action = useAsyncAction(
    useCallback(
      (draft: PeerTaskDraft) => savePeerTask(requireCohort(cohortId), sessionId, draft),
      [cohortId, sessionId]
    ),
    "The task didn't save. Try again."
  )
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
    save: async () => {
      if (!draft) return
      const found = taskDraftErrors(draft)
      setErrors(found)
      if (Object.keys(found).length > 0) return
      const saved = await action.run(draft)
      if (!saved) return
      showToast(sessionId ? 'Task saved.' : 'Task created.', 'success')
      router.push(DELIVERY_LEAD_ROUTES.tasks)
    },
    isSaving: action.isLoading,
    saveError: action.error,
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
