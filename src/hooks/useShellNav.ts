'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { NAV_BY_ROLE, type NavGroup, type NavItem } from '@/components/layout/navConfig'
import { navRoles, type RoleContext } from '@/lib/activeView'
import { useActiveView } from './useActiveView'

export type { RoleContext } from '@/lib/activeView'

export interface ShellNav {
  contexts: RoleContext[]
  active: RoleContext | null
  // True only when the user has roles in more than one cohort
  canSwitch: boolean
  setActiveKey: (key: string) => void
  // The first page of a cohort's links, so switching cohort can open it
  firstPageFor: (key: string) => string | null
  // Groups that have at least one link; headings matter only when there is more than one
  groups: NavGroup[]
  // Flat list for the mobile tab bar
  items: NavItem[]
  isActive: (href: string) => boolean
}

// The links for one cohort's roles, without repeats
function navGroups(context: RoleContext): NavGroup[] {
  const seen = new Set<string>()
  return navRoles(context)
    .flatMap((role) => [NAV_BY_ROLE[role]].flat())
    .map((group) => {
      const items = group.items.filter((item) => {
        if (seen.has(item.href)) return false
        seen.add(item.href)
        return true
      })
      return { heading: group.heading, items }
    })
    .filter((group) => group.items.length > 0)
}

// The shell's links for the view picked in "Switch view" (see hooks/useActiveView.ts)
export function useShellNav(): ShellNav {
  const pathname = usePathname()
  const { contexts, active, canSwitch, setActiveKey } = useActiveView()
  const groups = useMemo(() => (active ? navGroups(active) : []), [active])

  return {
    contexts,
    active,
    canSwitch,
    setActiveKey,
    firstPageFor: (key) => {
      const context = contexts.find((c) => c.key === key)
      return context ? (navGroups(context)[0]?.items[0]?.href ?? null) : null
    },
    groups,
    items: groups.flatMap((g) => g.items),
    // /dashboard is the home tab, so it only matches exactly
    isActive: (href) =>
      pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`)),
  }
}
