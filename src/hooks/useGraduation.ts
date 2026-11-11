'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import { loadCommitteeOverview } from '@/lib/committee'
import { byName, loadGraduationPreview, loadProgramLeadHome, revealOrder } from '@/lib/graduation'
import { isProgramLead } from '@/lib/roles'
import type { CommitteeOverviewView } from '@/types/committee'
import type { GraduateRow, GraduationPreviewView, ProgramLeadHomeView } from '@/types/graduation'
import { useActiveCohort } from './useActiveCohort'
import { useApiQuery, type ApiQuery } from './useApiQuery'
import { useAsyncAction } from './useAsyncAction'
import { useAuth } from './useAuth'
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
  // Runs the calculation again
  refresh: () => Promise<void>
  isRefreshing: boolean
  // Re-checks the password, then confirms graduation. True when it went through.
  graduate: (password: string) => Promise<boolean>
  isGraduating: boolean
  graduateError: string | null
  close: () => Promise<boolean>
  isClosing: boolean
  closeError: string | null
}

export function useGraduationPreview(): UseGraduationPreviewReturn {
  const { cohortId, isLoading, refresh: refreshCohorts } = useActiveCohort()
  const { user } = useAuth()
  const { showToast } = useToast()
  const forProgramLead = isProgramLead(user)
  const [search, setSearch] = useState('')
  const query = useApiQuery(
    () => loadGraduationPreview(cohortId as string, forProgramLead),
    [cohortId, forProgramLead],
    {
      enabled: cohortId !== null,
      fallbackError: "We couldn't load the graduation preview. Try again.",
    }
  )
  const refreshAction = useAsyncAction(
    useCallback(() => api.cohorts.graduation.refreshPreview(cohortId as string), [cohortId]),
    "The preview didn't recalculate. Try again."
  )
  const graduateAction = useAsyncAction(
    useCallback(
      async (password: string) => {
        const { confirmation_token } = await api.auth.confirmPassword(password)
        return api.cohorts.graduation.graduate(cohortId as string, confirmation_token)
      },
      [cohortId]
    ),
    "The cohort wasn't graduated. Try again."
  )
  const closeAction = useAsyncAction(
    useCallback(() => api.cohorts.close(cohortId as string), [cohortId]),
    "The cohort wasn't closed. Try again."
  )
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
    canGraduate:
      data !== null &&
      data.hasEnded &&
      !data.isGraduated &&
      (data.unavailableReasons === null || data.unavailableReasons.length === 0),
    refresh: async () => {
      if (await refreshAction.run()) {
        query.refetch()
        showToast('Preview recalculated.', 'success')
      }
    },
    isRefreshing: refreshAction.isLoading,
    graduate: async (password) => {
      const record = await graduateAction.run(password)
      if (!record) return false
      showToast(`${data?.cohortName ?? 'The cohort'} has graduated.`, 'success')
      refreshCohorts()
      query.refetch()
      return true
    },
    isGraduating: graduateAction.isLoading,
    graduateError: graduateAction.error,
    close: async () => {
      const closed = await closeAction.run()
      if (!closed) return false
      showToast(`${closed.name} is closed.`, 'success')
      refreshCohorts()
      query.refetch()
      return true
    },
    isClosing: closeAction.isLoading,
    closeError: closeAction.error,
  }
}

// The typed cohort name and password for confirming graduation or closing the cohort
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

export interface UseRevealOrderReturn extends ApiQuery<
  GraduationPreviewView & { savedOrder: string[] | null }
> {
  hasCohort: boolean
  mode: RevealMode
  setMode: (mode: RevealMode) => void
  order: GraduateRow[]
  move: (id: string, step: -1 | 1) => void
  // True when the order saved
  save: () => Promise<boolean>
  isSaving: boolean
  saveError: string | null
}

async function loadRevealOrder(
  cohortId: string
): Promise<GraduationPreviewView & { savedOrder: string[] | null }> {
  const [preview, sequence] = await Promise.all([
    loadGraduationPreview(cohortId),
    api.cohorts.graduation.sequence(cohortId).catch(() => null),
  ])
  return { ...preview, savedOrder: sequence?.graduates.map((entry) => entry.mentee.id) ?? null }
}

export function useRevealOrder(): UseRevealOrderReturn {
  const { cohortId, isLoading } = useActiveCohort()
  const { showToast } = useToast()
  const query = useApiQuery(() => loadRevealOrder(cohortId as string), [cohortId], {
    enabled: cohortId !== null,
    fallbackError: "We couldn't load the graduates. Try again.",
  })
  const [mode, setModeState] = useState<RevealMode>('alphabetical')
  const [custom, setCustom] = useState<GraduateRow[]>([])

  useEffect(() => {
    if (!query.data) return
    const saved = query.data.savedOrder
    const ordered = revealOrder(query.data.graduates, saved)
    setCustom(ordered)
    const isAlphabetical = ordered.every(
      (row, index) => row.id === [...ordered].sort(byName)[index].id
    )
    setModeState(saved && !isAlphabetical ? 'custom' : 'alphabetical')
  }, [query.data])

  const alphabetical = useMemo(() => [...(query.data?.graduates ?? [])].sort(byName), [query.data])
  const saveAction = useAsyncAction(
    useCallback(
      (ids: string[]) => api.cohorts.graduation.setRevealOrder(cohortId as string, ids),
      [cohortId]
    ),
    "The reveal order wasn't saved. Try again."
  )
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
    save: async () => {
      const saved = await saveAction.run(order.map((row) => row.id))
      if (saved) showToast('Reveal order saved.')
      return saved !== null
    },
    isSaving: saveAction.isLoading,
    saveError: saveAction.error,
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
  // Checks the fields, re-checks the password, then records the correction
  save: () => Promise<boolean>
  isSaving: boolean
  saveError: string | null
}

interface CorrectionInput {
  userId: string
  graduated: boolean
  reason: string
  password: string
}

export function useCorrection(): UseCorrectionReturn {
  const { cohortId, isLoading } = useActiveCohort()
  const { showToast } = useToast()
  // The correction route takes no password, so it is re-checked first as the design asks
  const correctAction = useAsyncAction(
    useCallback(
      async ({ userId, graduated, reason, password }: CorrectionInput) => {
        await api.auth.confirmPassword(password)
        return api.cohorts.graduation.correct(cohortId as string, {
          user_id: userId,
          graduated,
          reason,
        })
      },
      [cohortId]
    ),
    "The correction wasn't recorded. Try again."
  )
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
    save: async () => {
      const found = {
        reason: draft.reason.trim() ? undefined : 'Give the reason for the correction',
        password: draft.password ? undefined : 'Enter your password',
      }
      setErrors(found)
      if (found.reason || found.password || !selected) return false
      const saved = await correctAction.run({
        userId: selected.id,
        graduated: draft.result === 'graduated',
        reason: draft.reason.trim(),
        password: draft.password,
      })
      if (!saved) return false
      showToast(`${selected.name}'s result is corrected.`, 'success')
      setDraftState((current) => ({ ...current, reason: '', password: '' }))
      query.refetch()
      return true
    },
    isSaving: correctAction.isLoading,
    saveError: correctAction.error,
  }
}
