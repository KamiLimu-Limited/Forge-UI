// =============================================================================
// The cohort and role a signed-in person is looking at on /dashboard. Each cohort they
// hold a role in is one view; "Switch view" in the shell picks between them, and every
// participant screen reads the same choice through hooks/useActiveView.ts.
// =============================================================================

import { roleListLabel } from '@/lib/roles'
import type { UserProfileResponse, UserRole } from '@/types/auth'

// One cohort the user belongs to, plus any programme-wide roles (cohort_id null)
export interface RoleContext {
  key: string
  cohortId: string | null
  // null until it loads, or if it can't be read
  cohortName: string | null
  roles: UserRole[]
  roleLabel: string
}

// The screens /dashboard can show for a view
export type ViewRole =
  | 'mentee'
  | 'peer_mentor'
  | 'ict_peer_mentor'
  | 'alumni'
  | 'professional_mentor'
  | 'committee'

const VIEW_ROLES: Partial<Record<UserRole, ViewRole>> = {
  mentee: 'mentee',
  'peer_mentor_1:1': 'peer_mentor',
  peer_mentor_ict: 'ict_peer_mentor',
  alumni: 'alumni',
  professional_mentor: 'professional_mentor',
  committee: 'committee',
  // A committee member who also runs peer mentorship tasks
  program_delivery_lead: 'committee',
}

// Someone who graduated keeps their mentee role in that cohort, so alumni comes before
// mentee. Peer mentor roles come first because they are only held in a current cohort.
const VIEW_ROLE_ORDER: ViewRole[] = [
  'peer_mentor',
  'ict_peer_mentor',
  'alumni',
  'mentee',
  'professional_mentor',
  'committee',
]

export function viewRole(context: RoleContext | null): ViewRole | null {
  if (!context) return null
  const held = new Set(context.roles.flatMap((role) => VIEW_ROLES[role] ?? []))
  return VIEW_ROLE_ORDER.find((role) => held.has(role)) ?? null
}

// The roles whose links and label the shell shows. A graduate's old mentee links would
// open the mentee screens for a finished cohort, so alumni replaces them.
export function navRoles(context: Pick<RoleContext, 'roles'>): UserRole[] {
  return context.roles.includes('alumni')
    ? context.roles.filter((role) => role !== 'mentee')
    : context.roles
}

// Newest enrollment first, so the shell starts on the cohort the API defaults to
export function cohortIdsNewestFirst(user: UserProfileResponse | null): string[] {
  const roles = [...(user?.roles ?? [])].sort((a, b) => b.assigned_at.localeCompare(a.assigned_at))
  return Array.from(
    new Set(roles.map((r) => r.cohort_id).filter((id): id is string => id !== null))
  )
}

export function buildContexts(
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
      roleLabel: roleListLabel(navRoles({ roles })),
    }
  })
}
