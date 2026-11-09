// =============================================================================
// Attendance types, mapped directly from the Forge API OpenAPI schema
// =============================================================================

import type { PageParams } from '@/types/page'
import type { SessionBrief } from '@/types/session'

export type AttendanceStatus =
  | 'pending'
  | 'attended'
  | 'not_attended'
  | 'missed'
  | 'excused'
  | 'disputed'

export type OverrideRequestStatus = 'pending' | 'approved' | 'denied'

export interface AttendanceResponse {
  id: string
  mentee_id: string
  session_id: string
  status: AttendanceStatus
  quality_rating: number | null
  usefulness_rating: number | null
  understanding_score: number | null
  academic_application_score: number | null
  career_application_score: number | null
  feedback: string | null
  submitted_at: string | null
  updated_at: string
  session: SessionBrief
}

// The caller's own record, which also carries their private notes
export interface MyAttendanceResponse extends AttendanceResponse {
  personal_notes: string | null
}

// Ratings run from 1 to 5 and only count when status is attended
export interface AttendanceRatings {
  quality_rating?: number | null
  usefulness_rating?: number | null
  understanding_score?: number | null
  academic_application_score?: number | null
  career_application_score?: number | null
}

export interface AttendanceSubmissionRequest extends AttendanceRatings {
  session_id: string
  status: 'attended' | 'not_attended'
  feedback?: string | null
  personal_notes?: string | null
}

export interface AttendanceUpdateRequest extends AttendanceRatings {
  status?: 'attended' | 'not_attended' | null
  feedback?: string | null
  personal_notes?: string | null
}

export interface AttendanceStatusUpdateRequest {
  status: AttendanceStatus
  reason?: string | null
}

export interface AttendanceListParams extends PageParams {
  cohort_id?: string
  session_id?: string
  mentee_id?: string
  status?: AttendanceStatus
  kami_limu_month?: number
  track?: string
}

export interface OverrideRequestResponse {
  id: string
  mentee_id: string
  session_id: string
  reason: string
  status: OverrideRequestStatus
  reviewed_by: string | null
  reviewed_at: string | null
  review_reason: string | null
  created_at: string
  session: SessionBrief
}

export interface OverrideRequestCreate {
  session_id: string
  reason: string
}

export interface OverrideReviewRequest {
  reason?: string | null
  // Approval only; the API defaults to now plus its extension hours
  new_closes_at?: string | null
}

export interface OverrideListParams extends PageParams {
  status?: OverrideRequestStatus
  cohort_id?: string
  session_id?: string
}

// The attendance window as it applies to the caller, including any personal override
export interface WindowStatusResponse {
  session_id: string
  window_id: string
  opens_at: string
  closes_at: string
  // closes_at, or the later deadline of an approved override
  effective_closes_at: string
  is_active: boolean
  is_open: boolean
  has_override: boolean
  record_id: string | null
  record_status: AttendanceStatus | null
}
