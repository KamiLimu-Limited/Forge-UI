'use client'

import { useCallback, useState } from 'react'
import { api, fetchAllPages } from '@/lib/api'
import { errorMessage } from '@/lib/errors'
import type { InvitationResponse } from '@/types/invitation'
import { useApiQuery } from './useApiQuery'

interface UseInvitationsReturn {
  invitations: InvitationResponse[]
  isLoading: boolean
  error: string | null
  refetch: () => void
  resend: (id: string) => Promise<boolean>
  revoke: (id: string) => Promise<boolean>
  // The invitation a resend or revoke is running for
  busyId: string | null
  actionError: string | null
  clearActionError: () => void
}

// Invitations nobody has accepted yet, from GET /admin/invitations?pending_only=true
export function useInvitations(): UseInvitationsReturn {
  const query = useApiQuery(
    () =>
      fetchAllPages((page, page_size) =>
        api.admin.invitations.list({ page, page_size, pending_only: true })
      ),
    [],
    { fallbackError: "We couldn't load the pending invitations." }
  )
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const runFor = useCallback(
    async (id: string, call: () => Promise<unknown>, fallback: string): Promise<boolean> => {
      setBusyId(id)
      setActionError(null)
      try {
        await call()
        return true
      } catch (err: unknown) {
        setActionError(errorMessage(err, fallback))
        return false
      } finally {
        setBusyId(null)
      }
    },
    []
  )

  return {
    invitations: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    resend: async (id) => {
      const ok = await runFor(
        id,
        () => api.admin.invitations.resend(id),
        "The invitation wasn't resent. Try again."
      )
      if (ok) query.refetch()
      return ok
    },
    revoke: async (id) => {
      const ok = await runFor(
        id,
        () => api.admin.invitations.revoke(id),
        "The invitation wasn't revoked. Try again."
      )
      if (ok && query.data) query.setData(query.data.filter((i) => i.id !== id))
      return ok
    },
    busyId,
    actionError,
    clearActionError: () => setActionError(null),
  }
}
