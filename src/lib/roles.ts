import type { UserRole } from '@/types/auth'

// Human labels for every role. Use these anywhere a role is shown.
export const ROLE_LABELS: Record<UserRole, string> = {
  mentee: 'Mentee',
  'peer_mentor_1:1': '1:1 Peer Mentor',
  peer_mentor_ict: 'ICT Peer Mentor',
  professional_mentor: 'Professional Mentor',
  committee: 'Committee',
  partner: 'Partner',
  alumni: 'Alumni',
  admin: 'System Admin',
}

// Every role, in the order they appear in pickers
export const ALL_ROLES: UserRole[] = [
  'mentee',
  'peer_mentor_1:1',
  'peer_mentor_ict',
  'professional_mentor',
  'committee',
  'partner',
  'alumni',
  'admin',
]

export function roleLabel(role: UserRole): string {
  return ROLE_LABELS[role]
}

// "Mentee, Committee"
export function roleListLabel(roles: UserRole[]): string {
  return roles.map(roleLabel).join(', ')
}
