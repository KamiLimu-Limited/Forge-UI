'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { NAV_BY_ROLE, type NavGroup, type NavItem } from '@/components/layout/navConfig'
import { roleListLabel } from '@/lib/roles'
import type { UserProfileResponse, UserRole } from '@/types/auth'

// One cohort the user belongs to, plus any programme-wide roles (cohort_id null)
export interface RoleContext {
  key: string
  cohortId: string | null
  // The API has no cohort endpoint yet, so this is always null for now
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

function buildContexts(user: UserProfileResponse | null): RoleContext[] {
  if (!user) return []
  const globalRoles = user.roles.filter((r) => r.cohort_id === null).map((r) => r.role)
  const cohortIds = Array.from(
    new Set(user.roles.map((r) => r.cohort_id).filter((id): id is string => id !== null))
  )

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
    return { key: cohortId, cohortId, cohortName: null, roles, roleLabel: roleListLabel(roles) }
  })
}

export function useShellNav(user: UserProfileResponse | null): ShellNav {
  const pathname = usePathname()
  const [activeKey, setActiveKey] = useState<string | null>(null)

  const contexts = useMemo(() => buildContexts(user), [user])
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
    isActive: (href) => pathname === href || pathname.startsWith(`${href}/`),
  }
}
