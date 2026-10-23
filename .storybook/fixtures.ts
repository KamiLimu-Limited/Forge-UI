import type { UserProfileResponse } from '../src/types/auth'

// Sample users for stories. Not real people.

export const adminUser: UserProfileResponse = {
  id: 'u-admin',
  email: 'amina.otieno@example.com',
  first_name: 'Amina',
  last_name: 'Otieno',
  account_state: 'active',
  last_login_at: '2026-10-20T09:15:00Z',
  created_at: '2026-01-10T08:00:00Z',
  roles: [{ id: 'r1', role: 'admin', cohort_id: null, assigned_at: '2026-01-10T08:00:00Z' }],
}

export const menteeUser: UserProfileResponse = {
  id: 'u-mentee',
  email: 'brian.kamau@example.com',
  first_name: 'Brian',
  last_name: 'Kamau',
  account_state: 'active',
  last_login_at: '2026-10-21T17:40:00Z',
  created_at: '2026-02-01T08:00:00Z',
  roles: [{ id: 'r2', role: 'mentee', cohort_id: 'c-2026', assigned_at: '2026-02-01T08:00:00Z' }],
}

export const twoCohortUser: UserProfileResponse = {
  id: 'u-peer',
  email: 'wanjiru.mwangi@example.com',
  first_name: 'Wanjiru',
  last_name: 'Mwangi',
  account_state: 'active',
  last_login_at: '2026-10-22T07:05:00Z',
  created_at: '2025-02-01T08:00:00Z',
  roles: [
    { id: 'r3', role: 'peer_mentor_1:1', cohort_id: 'c-2026', assigned_at: '2026-02-01T08:00:00Z' },
    { id: 'r4', role: 'alumni', cohort_id: 'c-2025', assigned_at: '2025-02-01T08:00:00Z' },
  ],
}
