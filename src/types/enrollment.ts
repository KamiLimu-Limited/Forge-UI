// Cohort enrollment types, mapped directly from the Forge API OpenAPI schema

import type { UserRole } from '@/types/auth'
import type { PageParams } from '@/types/page'
import type { UserSummary } from '@/types/session'

export interface EnrollmentResponse {
  id: string
  cohort_id: string
  role: UserRole
  // User id of the mentee's 1:1 peer mentor
  peer_mentor_id: string | null
  ict_track: string | null
  enrolled_at: string
  // Set when a closed cohort's peer mentor assignments are archived
  archived_at: string | null
  user: UserSummary
}

// The peer mentor and ICT track are assigned later, not at enrolment
export interface EnrollmentRequest {
  user_id: string
  role?: UserRole
}

// ICT tracks change only through track selection or the admin override
export interface EnrollmentUpdateRequest {
  peer_mentor_id?: string | null
}

export interface EnrollmentListParams extends PageParams {
  role?: UserRole
  peer_mentor_id?: string
  ict_track?: string
}
