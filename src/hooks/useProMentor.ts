'use client'

import { useCallback, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import { errorMessage } from '@/lib/errors'
import { isWebLink, loadProFeedback, loadProSessions, resourcesWithFolder } from '@/lib/proMentor'
import type { ProFeedbackView, ProSessionRow, ProSessionsView } from '@/types/proMentor'
import { useApiQuery, type ApiQuery } from './useApiQuery'
import { useAuth } from './useAuth'
import { useToast } from './useToast'

export function useProSessions(): ApiQuery<ProSessionsView> {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  return useApiQuery(() => loadProSessions(userId), [userId], {
    enabled: userId !== '',
    fallbackError: "We couldn't load your sessions. Try again.",
  })
}

interface UseProFeedbackReturn {
  // Past sessions to pick from, newest first; null until they load
  sessions: ProSessionRow[] | null
  selectedId: string | null
  feedback: ProFeedbackView | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

// One past session's anonymous feedback. Defaults to the newest past session.
export function useProFeedback(requestedId: string | null): UseProFeedbackReturn {
  const sessions = useProSessions()
  const past = sessions.data?.past ?? null
  const selected = useMemo(
    () => past?.find((row) => row.id === requestedId) ?? past?.[0] ?? null,
    [past, requestedId]
  )
  const feedback = useApiQuery(
    () => (selected ? loadProFeedback(selected) : Promise.reject(new Error('No session'))),
    [selected?.id],
    { enabled: selected !== null, fallbackError: "We couldn't load this feedback. Try again." }
  )
  return {
    sessions: past,
    selectedId: selected?.id ?? null,
    feedback: feedback.data,
    isLoading: sessions.isLoading || feedback.isLoading,
    error: sessions.error ?? feedback.error,
    refetch: () => {
      sessions.refetch()
      feedback.refetch()
    },
  }
}

interface UseProResourcesReturn {
  data: ProSessionsView | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  // The link typed for each session; falls back to the saved link
  linkFor: (row: ProSessionRow) => string
  setLink: (sessionId: string, value: string) => void
  save: (row: ProSessionRow) => void
  savingId: string | null
  // A problem with one session's link, shown under its field
  fieldErrors: Record<string, string>
}

// Each session's Drive folder link, saved with PATCH /sessions/{id}/resources
export function useProResources(): UseProResourcesReturn {
  const query = useProSessions()
  const { showToast } = useToast()
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const save = useCallback(
    async (row: ProSessionRow) => {
      const value = (drafts[row.id] ?? row.materialsUrl ?? '').trim()
      if (value && !isWebLink(value)) {
        setFieldErrors((current) => ({
          ...current,
          [row.id]: 'Paste a full link, starting https://',
        }))
        return
      }
      setFieldErrors(({ [row.id]: _removed, ...rest }) => rest)
      setSavingId(row.id)
      try {
        const detail = await api.sessions.getById(row.id)
        await api.sessions.setResources(row.id, resourcesWithFolder(detail, value))
        showToast(`Link saved for ${row.title}`, 'success')
        query.refetch()
      } catch (err: unknown) {
        showToast(errorMessage(err, "We couldn't save that link. Try again."), 'error')
      } finally {
        setSavingId(null)
      }
    },
    [drafts, query, showToast]
  )

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    linkFor: (row) => drafts[row.id] ?? row.materialsUrl ?? '',
    setLink: (sessionId, value) => setDrafts((current) => ({ ...current, [sessionId]: value })),
    save: (row) => {
      void save(row)
    },
    savingId,
    fieldErrors,
  }
}
