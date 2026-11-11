'use client'

// useActiveView: the cohort and role every /dashboard screen shows. <ActiveViewProvider>
// is mounted in src/app/dashboard/layout.tsx. "Switch view" in the shell sets it, and
// Home, Sessions, Activities, Objectives and the leaderboards read it, so they always
// agree. The choice is saved on the account (PUT /users/me/active-cohort), so it follows
// the person to another device, and in localStorage for when that save fails. Never keep a
// second "current view".

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { api } from '@/lib/api'
import {
  buildContexts,
  cohortIdsNewestFirst,
  primaryRole,
  viewRole,
  type RoleContext,
  type ViewRole,
} from '@/lib/activeView'
import { useApiQuery } from './useApiQuery'
import { useAuth } from './useAuth'

export const ACTIVE_VIEW_STORAGE_KEY = 'kamilimu_active_view'

export interface ActiveViewContextValue {
  contexts: RoleContext[]
  active: RoleContext | null
  // True only when the user has roles in more than one cohort
  canSwitch: boolean
  setActiveKey: (key: string) => void
  // Which screens the active view shows, and the cohort they load from
  role: ViewRole | null
  cohortId: string | null
}

export const ActiveViewContext = createContext<ActiveViewContextValue | null>(null)

function readStoredKey(): string | null {
  try {
    return window.localStorage.getItem(ACTIVE_VIEW_STORAGE_KEY)
  } catch {
    return null
  }
}

function storeKey(key: string): void {
  try {
    window.localStorage.setItem(ACTIVE_VIEW_STORAGE_KEY, key)
  } catch {
    // Storage can be blocked; the choice then lasts for this visit only
  }
}

async function loadCohortNames(): Promise<Record<string, string>> {
  const cohorts = await api.users.myCohorts()
  return Object.fromEntries(cohorts.map((item) => [item.cohort.id, item.cohort.name]))
}

interface ActiveViewProviderProps {
  children?: ReactNode
}

export function ActiveViewProvider({ children }: ActiveViewProviderProps) {
  const { user } = useAuth()
  const [activeKey, setKey] = useState<string | null>(null)

  // The account's choice wins; this device's is the fallback
  useEffect(() => setKey(user?.active_cohort_id ?? readStoredKey()), [user?.active_cohort_id])

  const cohortIds = useMemo(() => cohortIdsNewestFirst(user), [user])
  const names = useApiQuery(() => loadCohortNames(), [cohortIds.join()], {
    enabled: cohortIds.length > 0,
  })
  const contexts = useMemo(() => buildContexts(user, names.data ?? {}), [user, names.data])

  const setActiveKey = useCallback(
    (key: string) => {
      setKey(key)
      storeKey(key)
      const picked = contexts.find((context) => context.key === key)
      const role = picked ? primaryRole(picked) : null
      if (picked?.cohortId && role) {
        // The view already switched; failing to save only means another device won't follow
        api.users.setActiveCohort({ cohort_id: picked.cohortId, role }).catch(() => undefined)
      }
    },
    [contexts]
  )

  const value = useMemo<ActiveViewContextValue>(() => {
    const active = contexts.find((c) => c.key === activeKey) ?? contexts[0] ?? null
    return {
      contexts,
      active,
      canSwitch: contexts.length > 1,
      setActiveKey,
      role: viewRole(active),
      cohortId: active?.cohortId ?? null,
    }
  }, [contexts, activeKey, setActiveKey])

  return createElement(ActiveViewContext.Provider, { value }, children)
}

export function useActiveView(): ActiveViewContextValue {
  const ctx = useContext(ActiveViewContext)
  if (!ctx) throw new Error('useActiveView must be used inside <ActiveViewProvider>')
  return ctx
}
