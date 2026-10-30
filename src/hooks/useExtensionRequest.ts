'use client'

import { useCallback, useState } from 'react'
import { api } from '@/lib/api'
import { loadExtension } from '@/lib/sessionRecord'
import type { ExtensionView } from '@/types/menteeSessions'
import { useApiQuery, type ApiQuery } from './useApiQuery'
import { useAsyncAction } from './useAsyncAction'
import { useToast } from './useToast'

interface UseExtensionRequestReturn extends ApiQuery<ExtensionView> {
  reason: string
  setReason: (reason: string) => void
  // Shown after trying to send with no reason
  reasonError: string | null
  send: () => Promise<void>
  isSending: boolean
  sendError: string | null
}

export function useExtensionRequest(sessionId: string): UseExtensionRequestReturn {
  const { showToast } = useToast()
  const query = useApiQuery(() => loadExtension(sessionId), [sessionId], {
    fallbackError: "We couldn't load this session. Try again.",
  })
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState<string | null>(null)

  const create = useCallback(
    (text: string) =>
      api.attendance.overrideRequests.create({ session_id: sessionId, reason: text }),
    [sessionId]
  )
  const action = useAsyncAction(create, "We couldn't send your request. Try again.")

  return {
    ...query,
    reason,
    setReason: (next) => {
      setReason(next)
      setReasonError(null)
    },
    reasonError,
    send: async () => {
      const text = reason.trim()
      if (!text) {
        setReasonError('Tell us why you need an extension')
        return
      }
      const sent = await action.run(text)
      if (!sent) return
      setReason('')
      showToast('Request sent', 'success')
      query.refetch()
    },
    isSending: action.isLoading,
    sendError: action.error,
  }
}
