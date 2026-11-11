// Attendance types, mapped directly from the Forge API OpenAPI schema

import type { PageParams } from '@/types/page'
import type { SessionBrief } from '@/types/session'

export type AttendanceStatus = 'pending' | 'present' | 'absent' | 'missed' | 'excused'

// Whether a submission came in on time or under an approved extension
export type AttendanceSource = 'on_time' | 'reopened'

export type OverrideRequestStatus = 'pending' | 'approved' | 'denied'

export interface AttendanceResponse {
  id: string
  mentee_id: string
  session_id: string
  status: AttendanceStatus
  source: AttendanceSource | null
  // Answers (1 to 5) to the cohort's nine rating questions, in question order
  ratings: (number | null)[] | null
  feedback: string | null
  submitted_at: string | null
  updated_at: string
  session: SessionBrief
}

// `present` needs all nine ratings and feedback; `absent` takes neither
export interface AttendanceSubmissionRequest {
  session_id: string
  status: 'present' | 'absent'
  ratings?: number[] | null
  feedback?: string | null
}

export interface AttendanceUpdateRequest {
  status?: 'present' | 'absent' | null
  ratings?: number[] | null
  feedback?: string | null
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
  // The deadline the participant asked for, if they gave one
  requested_closes_at: string | null
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
  requested_closes_at?: string | null
}

export interface OverrideReviewRequest {
  reason?: string | null
  // Approval only; defaults to the deadline asked for, else now plus the API's extension hours
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
