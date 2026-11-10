'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadCommitteeOverview } from '@/lib/committee'
import {
  byName,
  loadGraduationPreview,
  loadProgramLeadHome,
  readSavedOrder,
  revealOrder,
  saveOrderForRehearsal,
} from '@/lib/graduation'
import type { CommitteeOverviewView } from '@/types/committee'
import type { GraduateRow, GraduationPreviewView, ProgramLeadHomeView } from '@/types/graduation'
import { useActiveCohort } from './useActiveCohort'
import { useApiQuery, type ApiQuery } from './useApiQuery'
import { useMenteeDirectory } from './useMenteeDirectory'
import { useToast } from './useToast'

export interface ProgramLeadHomeData {
  overview: CommitteeOverviewView
  home: ProgramLeadHomeView
}

export function useProgramLeadHome(): ApiQuery<ProgramLeadHomeData> & { hasCohort: boolean } {
  const { cohortId, isLoading } = useActiveCohort()
  const directory = useMenteeDirectory(cohortId)
  const query = useApiQuery(
    async () => {
      const id = cohortId as string
      const [overview, home] = await Promise.all([
        loadCommitteeOverview(id),
        loadProgramLeadHome(id, directory.nameFor),
      ])
      return { overview, home }
    },
    [cohortId, directory.mentees.length],
    { enabled: cohortId !== null, fallbackError: "We couldn't load the overview. Try again." }
  )
  return { ...query, isLoading: isLoading || query.isLoading, hasCohort: cohortId !== null }
}

export interface UseGraduationPreviewReturn extends ApiQuery<GraduationPreviewView> {
  hasCohort: boolean
  search: string
  setSearch: (value: string) => void
  // Graduates matching the search
  graduates: GraduateRow[]
  // Graduate cohort needs the end date passed and a preview to confirm
  canGraduate: boolean
}

export function useGraduationPreview(): UseGraduationPreviewReturn {
  const { cohortId, isLoading } = useActiveCohort()
  const [search, setSearch] = useState('')
  const query = useApiQuery(() => loadGraduationPreview(cohortId as string), [cohortId], {
    enabled: cohortId !== null,
    fallbackError: "We couldn't load the graduation preview. Try again.",
  })
  const graduates = useMemo(() => {
    const term = search.trim().toLowerCase()
    const all = query.data?.graduates ?? []
    return term ? all.filter((row) => row.name.toLowerCase().includes(term)) : all
  }, [query.data, search])
  const data = query.data
  return {
    ...query,
    isLoading: isLoading || query.isLoading,
    hasCohort: cohortId !== null,
    search,
    setSearch,
    graduates,
    canGraduate: data !== null && data.hasEnded && !data.isGraduated,
  }
}

// The typed cohort name and password for confirming graduation, correcting a result or
// closing the cohort. Nothing is sent: the API has none of these routes yet.
export interface ConfirmFields {
  cohortName: string
  password: string
}

export function useConfirmFields(): {
  fields: ConfirmFields
  setFields: (changes: Partial<ConfirmFields>) => void
  reset: () => void
} {
  const [fields, setState] = useState<ConfirmFields>({ cohortName: '', password: '' })
  return {
    fields,
    setFields: (changes) => setState((current) => ({ ...current, ...changes })),
    reset: () => setState({ cohortName: '', password: '' }),
  }
}

export type RevealMode = 'alphabetical' | 'custom'

export interface UseRevealOrderReturn extends ApiQuery<GraduationPreviewView> {
  hasCohort: boolean
  mode: RevealMode
  setMode: (mode: RevealMode) => void
  order: GraduateRow[]
  move: (id: string, step: -1 | 1) => void
  // Keeps this order in this browser for a rehearsal; the API can't store it yet
  rehearse: () => void
}

export function useRevealOrder(): UseRevealOrderReturn {
  const { cohortId, isLoading } = useActiveCohort()
  const { showToast } = useToast()
  const query = useApiQuery(() => loadGraduationPreview(cohortId as string), [cohortId], {
    enabled: cohortId !== null,
    fallbackError: "We couldn't load the graduates. Try again.",
  })
  const [mode, setModeState] = useState<RevealMode>('alphabetical')
  const [custom, setCustom] = useState<GraduateRow[]>([])

  useEffect(() => {
    if (!query.data || !cohortId) return
    const saved = readSavedOrder(cohortId)
    setCustom(revealOrder(query.data.graduates, saved))
    if (saved) setModeState('custom')
  }, [query.data, cohortId])

  const alphabetical = useMemo(() => [...(query.data?.graduates ?? [])].sort(byName), [query.data])
  const order = mode === 'alphabetical' ? alphabetical : custom

  const move = useCallback((id: string, step: -1 | 1) => {
    setCustom((current) => {
      const index = current.findIndex((row) => row.id === id)
      const target = index + step
      if (index < 0 || target < 0 || target >= current.length) return current
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }, [])

  return {
    ...query,
    isLoading: isLoading || query.isLoading,
    hasCohort: cohortId !== null,
    mode,
    setMode: (next) => {
      if (next === 'custom' && custom.length === 0) setCustom(alphabetical)
      setModeState(next)
    },
    order,
    move,
    rehearse: () => {
      if (!cohortId) return
      saveOrderForRehearsal(
        cohortId,
        order.map((row) => row.id)
      )
      showToast('Order kept in this browser for the rehearsal', 'info')
    },
  }
}

export type CorrectedResult = 'graduated' | 'not_graduated'

export interface CorrectionDraft {
  menteeId: string
  result: CorrectedResult
  reason: string
  password: string
}

export interface UseCorrectionReturn extends ApiQuery<GraduationPreviewView> {
  hasCohort: boolean
  draft: CorrectionDraft
  setDraft: (changes: Partial<CorrectionDraft>) => void
  // The chosen mentee as the confirmed list has them
  selected: (GraduateRow & { graduated: boolean }) | null
  errors: { reason?: string; password?: string }
  check: () => void
  // Recording a correction waits for POST /cohorts/{id}/graduation/corrections
  canSave: boolean
}

export function useCorrection(): UseCorrectionReturn {
  const { cohortId, isLoading } = useActiveCohort()
  const query = useApiQuery(() => loadGraduationPreview(cohortId as string), [cohortId], {
    enabled: cohortId !== null,
    fallbackError: "We couldn't load the graduation record. Try again.",
  })
  const [draft, setDraftState] = useState<CorrectionDraft>({
    menteeId: '',
    result: 'graduated',
    reason: '',
    password: '',
  })
  const [errors, setErrors] = useState<UseCorrectionReturn['errors']>({})
  const everyone = useMemo(
    () =>
      query.data
        ? [
            ...query.data.graduates.map((row) => ({ ...row, graduated: true })),
            ...query.data.nonGraduates.map((row) => ({ ...row, graduated: false })),
          ].sort(byName)
        : [],
    [query.data]
  )
  const selected = everyone.find((row) => row.id === draft.menteeId) ?? everyone[0] ?? null

  return {
    ...query,
    isLoading: isLoading || query.isLoading,
    hasCohort: cohortId !== null,
    draft: { ...draft, menteeId: selected?.id ?? '' },
    setDraft: (changes) => {
      setDraftState((current) => {
        const next = { ...current, ...changes }
        // A new mentee starts on the opposite of their current result
        if (changes.menteeId !== undefined) {
          const row = everyone.find((item) => item.id === changes.menteeId)
          if (row) next.result = row.graduated ? 'not_graduated' : 'graduated'
        }
        return next
      })
      setErrors({})
    },
    selected,
    errors,
    check: () =>
      setErrors({
        reason: draft.reason.trim() ? undefined : 'Give the reason for the correction',
        password: draft.password ? undefined : 'Enter your password',
      }),
    canSave: false,
  }
}
