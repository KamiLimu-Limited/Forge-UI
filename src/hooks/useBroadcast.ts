'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { errorMessage } from '@/lib/errors'
import type { UserRole } from '@/types/auth'
import type { BroadcastRequest } from '@/types/notification'
import { useActiveCohort } from './useActiveCohort'
import { useApiQuery } from './useApiQuery'
import { useToast } from './useToast'

export type BroadcastTarget = 'cohort' | 'cohort-role' | 'alumni' | 'everyone'
export type RoleGroup = 'all' | 'mentees' | 'peer-mentors' | 'professional-mentors' | 'committee'

export const ROLE_GROUPS: Record<RoleGroup, UserRole[]> = {
  all: [],
  mentees: ['mentee'],
  'peer-mentors': ['peer_mentor_1_1', 'peer_mentor_ict'],
  'professional-mentors': ['professional_mentor'],
  committee: ['committee'],
}

export interface BroadcastDraft {
  target: BroadcastTarget
  roleGroup: RoleGroup
  subject: string
  message: string
}

interface UseBroadcastReturn {
  cohortName: string | null
  draft: BroadcastDraft
  setDraft: (changes: Partial<BroadcastDraft>) => void
  // How many people it goes to, worked out from the cohort's enrollment counts; null when
  // that can't be known before sending
  recipients: number | null
  errors: { target?: string; subject?: string; message?: string }
  // Checks the form and opens the confirm step
  review: () => void
  isConfirming: boolean
  cancel: () => void
  send: () => void
  isSending: boolean
  sendError: string | null
}

const EMPTY: BroadcastDraft = { target: 'cohort', roleGroup: 'all', subject: '', message: '' }

export function toRequest(draft: BroadcastDraft, cohortId: string | null): BroadcastRequest {
  const roles = ROLE_GROUPS[draft.roleGroup]
  const base = { title: draft.subject.trim(), message: draft.message.trim(), send_email: true }
  if (draft.target === 'everyone') return base
  if (draft.target === 'alumni') return { ...base, roles: ['alumni'] }
  return {
    ...base,
    cohort_id: cohortId,
    roles: draft.target === 'cohort-role' && roles.length > 0 ? roles : null,
  }
}

// A message to everyone, a cohort, or role holders, by email and in notifications
export function useBroadcast(): UseBroadcastReturn {
  const active = useActiveCohort()
  const { showToast } = useToast()
  const [draft, setDraftState] = useState<BroadcastDraft>(EMPTY)
  const [errors, setErrors] = useState<UseBroadcastReturn['errors']>({})
  const [isConfirming, setIsConfirming] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  const detail = useApiQuery(
    () => api.cohorts.getById(active.cohortId as string),
    [active.cohortId],
    {
      enabled: active.cohortId !== null,
    }
  )

  const counts = detail.data?.enrollment_counts ?? null
  const roles = ROLE_GROUPS[draft.roleGroup]
  const recipients =
    counts === null || draft.target === 'alumni' || draft.target === 'everyone'
      ? null
      : Object.entries(counts)
          .filter(
            ([role]) =>
              draft.target === 'cohort' || roles.length === 0 || roles.includes(role as UserRole)
          )
          .reduce((total, [, count]) => total + count, 0)

  return {
    cohortName: active.cohort?.name ?? null,
    draft,
    setDraft: (changes) => {
      setDraftState((current) => ({ ...current, ...changes }))
      setErrors({})
    },
    recipients,
    errors,
    review: () => {
      // Without a cohort id the API sends to everyone, so a cohort message needs a cohort
      const needsCohort = draft.target === 'cohort' || draft.target === 'cohort-role'
      const next = {
        target: needsCohort && !active.cohortId ? 'Choose a cohort first' : undefined,
        subject: draft.subject.trim() ? undefined : 'Write a subject',
        message: draft.message.trim() ? undefined : 'Write the message',
      }
      setErrors(next)
      if (!next.target && !next.subject && !next.message) {
        setSendError(null)
        setIsConfirming(true)
      }
    },
    isConfirming,
    cancel: () => setIsConfirming(false),
    send: () => {
      setIsSending(true)
      setSendError(null)
      api.notifications
        .broadcast(toRequest(draft, active.cohortId))
        .then((result) => {
          showToast(
            `Message sent to ${result.recipients} ${result.recipients === 1 ? 'person' : 'people'}`,
            'success'
          )
          setIsConfirming(false)
          setDraftState(EMPTY)
        })
        .catch((err: unknown) =>
          setSendError(errorMessage(err, "We couldn't send the message. Try again."))
        )
        .finally(() => setIsSending(false))
    },
    isSending,
    sendError,
  }
}
