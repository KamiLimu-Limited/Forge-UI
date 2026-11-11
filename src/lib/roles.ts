import type { UserProfileResponse, UserRole } from '@/types/auth'

// Human labels for every role. Use these anywhere a role is shown.
export const ROLE_LABELS: Record<UserRole, string> = {
  mentee: 'Mentee',
  peer_mentor_1_1: '1:1 Peer Mentor',
  peer_mentor_ict: 'ICT Peer Mentor',
  professional_mentor: 'Professional Mentor',
  committee: 'Committee',
  alumni: 'Alumni',
  admin: 'System Admin',
  program_lead: 'Program Lead',
  program_delivery_lead: 'Program Delivery Lead',
}

// Every role, in the order they appear in pickers
export const ALL_ROLES: UserRole[] = [
  'mentee',
  'peer_mentor_1_1',
  'peer_mentor_ict',
  'professional_mentor',
  'committee',
  'program_delivery_lead',
  'program_lead',
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

export function hasRole(user: UserProfileResponse | null, roles: UserRole[]): boolean {
  return user?.roles.some((item) => roles.includes(item.role)) ?? false
}

// The Program Lead holds every System Admin power, so both open the admin screens
export const ADMIN_ROLES: UserRole[] = ['admin', 'program_lead']

export function isProgramLead(user: UserProfileResponse | null): boolean {
  return hasRole(user, ['program_lead'])
}

// Where "Go to your home" leads
export function homeFor(user: UserProfileResponse | null): string {
  return hasRole(user, ADMIN_ROLES) ? '/admin' : '/dashboard'
}

// "Mentee, Committee" for everything a person holds, each role once
export function userRoleLabel(user: UserProfileResponse | null): string {
  return roleListLabel(Array.from(new Set((user?.roles ?? []).map((item) => item.role))))
}
