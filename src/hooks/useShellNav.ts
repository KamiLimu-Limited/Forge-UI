'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { NAV_BY_ROLE, type NavGroup, type NavItem } from '@/components/layout/navConfig'
import { api } from '@/lib/api'
import { roleListLabel } from '@/lib/roles'
import type { UserProfileResponse, UserRole } from '@/types/auth'
import { useApiQuery } from './useApiQuery'

// One cohort the user belongs to, plus any programme-wide roles (cohort_id null)
export interface RoleContext {
  key: string
  cohortId: string | null
  // null until it loads, or if it can't be read
  cohortName: string | null
  roles: UserRole[]
  roleLabel: string
}

export interface ShellNav {
  contexts: RoleContext[]
  active: RoleContext | null
  // True only when the user has roles in more than one cohort
  canSwitch: boolean
  setActiveKey: (key: string) => void
  // Groups that have at least one link; headings matter only when there is more than one
  groups: NavGroup[]
  // Flat list for the mobile tab bar
  items: NavItem[]
  isActive: (href: string) => boolean
}

// Newest enrollment first, so the shell starts on the cohort the API defaults to
function cohortIdsNewestFirst(user: UserProfileResponse | null): string[] {
  const roles = [...(user?.roles ?? [])].sort((a, b) => b.assigned_at.localeCompare(a.assigned_at))
  return Array.from(
    new Set(roles.map((r) => r.cohort_id).filter((id): id is string => id !== null))
  )
}

async function loadCohortNames(cohortIds: string[]): Promise<Record<string, string>> {
  const results = await Promise.allSettled(cohortIds.map((id) => api.cohorts.getById(id)))
  return Object.fromEntries(
    results.flatMap((result) =>
      result.status === 'fulfilled' ? [[result.value.id, result.value.name]] : []
    )
  )
}

function buildContexts(
  user: UserProfileResponse | null,
  names: Record<string, string>
): RoleContext[] {
  if (!user) return []
  const globalRoles = user.roles.filter((r) => r.cohort_id === null).map((r) => r.role)
  const cohortIds = cohortIdsNewestFirst(user)

  if (cohortIds.length === 0) {
    return globalRoles.length === 0
      ? []
      : [
          {
            key: 'programme',
            cohortId: null,
            cohortName: null,
            roles: globalRoles,
            roleLabel: roleListLabel(globalRoles),
          },
        ]
  }

  return cohortIds.map((cohortId) => {
    const cohortRoles = user.roles.filter((r) => r.cohort_id === cohortId).map((r) => r.role)
    const roles = [...cohortRoles, ...globalRoles.filter((r) => !cohortRoles.includes(r))]
    return {
      key: cohortId,
      cohortId,
      cohortName: names[cohortId] ?? null,
      roles,
      roleLabel: roleListLabel(roles),
    }
  })
}

export function useShellNav(user: UserProfileResponse | null): ShellNav {
  const pathname = usePathname()
  const [activeKey, setActiveKey] = useState<string | null>(null)

  const cohortIds = useMemo(() => cohortIdsNewestFirst(user), [user])
  const names = useApiQuery(() => loadCohortNames(cohortIds), [cohortIds.join()], {
    enabled: cohortIds.length > 0,
  })
  const contexts = useMemo(() => buildContexts(user, names.data ?? {}), [user, names.data])
  const active = contexts.find((c) => c.key === activeKey) ?? contexts[0] ?? null

  const groups = useMemo(() => {
    if (!active) return []
    const seen = new Set<string>()
    return active.roles
      .map((role) => {
        const group = NAV_BY_ROLE[role]
        const items = group.items.filter((item) => {
          if (seen.has(item.href)) return false
          seen.add(item.href)
          return true
        })
        return { heading: group.heading, items }
      })
      .filter((group) => group.items.length > 0)
  }, [active])

  return {
    contexts,
    active,
    canSwitch: contexts.length > 1,
    setActiveKey,
    groups,
    items: groups.flatMap((g) => g.items),
    // /dashboard is the home tab, so it only matches exactly
    isActive: (href) =>
      pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`)),
  }
}
