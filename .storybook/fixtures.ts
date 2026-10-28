import type { UserProfileResponse } from '../src/types/auth'
import type { CohortResponse } from '../src/types/cohort'
import type { SessionResponse } from '../src/types/session'
import type { EnrollmentResponse } from '../src/types/enrollment'
import type { MentorOption } from '../src/hooks/useMentorOptions'

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

// ---- Admin screens. Sample data for stories only; nothing in src/ uses it. ----

export const sampleCohort: CohortResponse = {
  id: 'c-2026',
  name: 'Cohort 11',
  programme_type: 'undergraduate',
  start_date: '2026-03-26',
  end_date: '2026-11-26',
  graduation_threshold: 80,
  status: 'active',
  kami_limu_month_boundaries: Array.from({ length: 8 }, (_, i) => ({
    month: i + 1,
    name: null,
    start: `2026-${String(i + 3).padStart(2, '0')}-26`,
    end: `2026-${String(i + 4).padStart(2, '0')}-25`,
  })),
  ict_tracks_offered: [
    'Cloud Engineering',
    'Software Engineering',
    'Data Science',
    'Cybersecurity',
  ],
  skill_names: null,
  skill_rating_windows: null,
  leaderboard_anonymous: false,
  peer_mentorship_deadline_hours: null,
  created_at: '2026-02-01T08:00:00Z',
  updated_at: '2026-02-01T08:00:00Z',
}

export const archivedCohort: CohortResponse = {
  ...sampleCohort,
  id: 'c-2025',
  name: 'Cohort 10',
  status: 'completed',
  start_date: '2025-03-27',
  end_date: '2025-11-27',
}

export const sampleSession: SessionResponse = {
  id: 's-1',
  cohort_id: 'c-2026',
  title: 'Cybersecurity: ICT Training 8',
  description: null,
  kami_limu_month: 5,
  starts_at: '2026-08-27T14:30:00Z',
  ends_at: '2026-08-27T17:00:00Z',
  duration_minutes: 150,
  category: 'thursday',
  session_type: 'ict',
  track: 'Cybersecurity',
  mode: 'virtual',
  location: 'https://meet.google.com/abc-defg-hij',
  points: 10,
  status: 'published',
  attendance_deadline: null,
  original_starts_at: null,
  mentors: [],
  resources: [],
}

export const sampleMentors: MentorOption[] = [
  {
    id: 'm-1',
    name: 'Grace Wambui',
    email: 'grace.wambui@example.com',
    role: 'professional_mentor',
    roleLabel: 'Professional Mentor',
  },
  {
    id: 'm-2',
    name: 'Otieno Kariuki',
    email: 'otieno.kariuki@example.com',
    role: 'peer_mentor_ict',
    roleLabel: 'ICT Peer Mentor',
  },
  {
    id: 'm-3',
    name: 'Achieng Odhiambo',
    email: 'achieng.odhiambo@example.com',
    role: 'peer_mentor_1:1',
    roleLabel: '1:1 Peer Mentor',
  },
]

export function sampleEnrollment(id: string, first: string, last: string): EnrollmentResponse {
  return {
    id,
    cohort_id: 'c-2026',
    role: 'mentee',
    peer_mentor_id: null,
    ict_track: null,
    enrolled_at: '2026-03-26T08:00:00Z',
    user: {
      id: `u-${id}`,
      email: `${first.toLowerCase()}@example.com`,
      first_name: first,
      last_name: last,
    },
  }
}
