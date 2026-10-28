'use client'

import { useMemo, useState } from 'react'
import { api, fetchAllPages } from '@/lib/api'
import { errorMessage } from '@/lib/errors'
import type { MentorAssignment, SessionResponse } from '@/types/session'
import { useApiQuery } from './useApiQuery'

export interface SessionMentorDraft {
  leadId: string
  coIds: string[]
}

export interface ProAssignmentRow {
  session: SessionResponse
  draft: SessionMentorDraft
  isChanged: boolean
}

interface UseProAssignmentsReturn {
  rows: ProAssignmentRow[]
  isLoading: boolean
  error: string | null
  refetch: () => void
  setLead: (sessionId: string, leadId: string) => void
  setCoMentors: (sessionId: string, ids: string[]) => void
  changeCount: number
  save: () => Promise<{ saved: number; failed: string[] }>
  isSaving: boolean
}

function savedDraft(session: SessionResponse): SessionMentorDraft {
  return {
    leadId: session.mentors.find((m) => m.mentor_role === 'lead')?.user.id ?? '',
    coIds: session.mentors.filter((m) => m.mentor_role === 'co_mentor').map((m) => m.user.id),
  }
}

function sameDraft(a: SessionMentorDraft, b: SessionMentorDraft): boolean {
  return a.leadId === b.leadId && [...a.coIds].sort().join() === [...b.coIds].sort().join()
}

// Upcoming sessions and their mentors. "unassigned" keeps sessions with no lead mentor.
export function useProAssignments(
  cohortId: string | null,
  view: 'unassigned' | 'all'
): UseProAssignmentsReturn {
  // Fixed once per load so the list doesn't shift while editing
  const query = useApiQuery(
    () =>
      fetchAllPages((page, page_size) =>
        api.sessions.list({
          page,
          page_size,
          cohort_id: cohortId as string,
          starts_after: new Date().toISOString(),
        })
      ),
    [cohortId],
    { enabled: cohortId !== null, fallbackError: "We couldn't load the upcoming sessions." }
  )
  const [drafts, setDrafts] = useState<Record<string, SessionMentorDraft>>({})
  const [isSaving, setIsSaving] = useState(false)

  const rows = useMemo<ProAssignmentRow[]>(() => {
    return (query.data ?? [])
      .filter((s) => s.status !== 'cancelled')
      .filter(
        (s) => view === 'all' || !s.mentors.some((m) => m.mentor_role === 'lead') || s.id in drafts
      )
      .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
      .map((session) => {
        const draft = drafts[session.id] ?? savedDraft(session)
        return { session, draft, isChanged: !sameDraft(draft, savedDraft(session)) }
      })
  }, [query.data, drafts, view])

  const update = (sessionId: string, patch: Partial<SessionMentorDraft>) => {
    const session = query.data?.find((s) => s.id === sessionId)
    if (!session) return
    setDrafts((d) => {
      const current = d[sessionId] ?? savedDraft(session)
      const next = { ...current, ...patch }
      next.coIds = next.coIds.filter((id) => id !== next.leadId)
      return { ...d, [sessionId]: next }
    })
  }

  const save = async () => {
    const changed = rows.filter((r) => r.isChanged)
    setIsSaving(true)
    const results = await Promise.all(
      changed.map(async ({ session, draft }) => {
        const mentors: MentorAssignment[] = [
          ...(draft.leadId ? [{ user_id: draft.leadId, mentor_role: 'lead' as const }] : []),
          ...draft.coIds.map((id) => ({ user_id: id, mentor_role: 'co_mentor' as const })),
        ]
        try {
          return { updated: await api.sessions.setMentors(session.id, mentors), error: null }
        } catch (err: unknown) {
          return { updated: null, error: `${session.title}: ${errorMessage(err, 'not saved')}` }
        }
      })
    )
    setIsSaving(false)
    const updated = results.flatMap((r) => (r.updated ? [r.updated] : []))
    if (query.data) {
      query.setData(query.data.map((s) => updated.find((u) => u.id === s.id) ?? s))
    }
    setDrafts((d) => {
      const next = { ...d }
      for (const u of updated) delete next[u.id]
      return next
    })
    return {
      saved: updated.length,
      failed: results.flatMap((r) => (r.error ? [r.error] : [])),
    }
  }

  return {
    rows,
    isLoading: query.isLoading,
    error: query.error,
    refetch: () => {
      setDrafts({})
      query.refetch()
    },
    setLead: (id, leadId) => update(id, { leadId }),
    setCoMentors: (id, coIds) => update(id, { coIds }),
    changeCount: rows.filter((r) => r.isChanged).length,
    save,
    isSaving,
  }
}
