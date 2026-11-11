'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { SessionRecordView } from '@/types/menteeSessions'
import { useAsyncAction } from './useAsyncAction'
import { useToast } from './useToast'

interface UseSessionNotesReturn {
  notes: string
  setNotes: (notes: string) => void
  save: () => Promise<void>
  isSaving: boolean
  error: string | null
  savedAt: string | null
}

export function useSessionNotes(session: SessionRecordView | null): UseSessionNotesReturn {
  const { showToast } = useToast()
  const [notes, setNotes] = useState('')
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const sessionId = session?.id ?? null

  useEffect(() => {
    setNotes(session?.notes ?? '')
    setSavedAt(session?.savedAt ?? null)
  }, [session])

  const send = useCallback(
    (text: string) => {
      if (!sessionId) return Promise.reject(new Error('Session not loaded'))
      return api.sessions.saveMyNotes(sessionId, text)
    },
    [sessionId]
  )
  const action = useAsyncAction(send, "We couldn't save your notes. Try again.")

  return {
    notes,
    setNotes,
    save: async () => {
      const saved = await action.run(notes)
      if (!saved) return
      setSavedAt(saved.updated_at)
      showToast('Notes saved', 'success')
    },
    isSaving: action.isLoading,
    error: action.error,
    savedAt,
  }
}
