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

export interface AttendanceStatusUpdateRequest {
  status: AttendanceStatus
  reason?: string | null
}

export interface AttendanceListParams extends PageParams {
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
