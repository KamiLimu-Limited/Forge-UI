// =============================================================================
// Dashboard types, mapped directly from the Forge API OpenAPI schema
// =============================================================================

import type { ActivityType } from '@/types/activity'
import type { SessionBrief, SessionType, UserSummary } from '@/types/session'

export interface CohortHealthResponse {
  cohort_id: string
  total_mentees: number
  // Mentees per graduation status
  counts: Record<string, number>
  average_core_rate: number
  average_combined_rate: number
  pending_override_requests: number
  pending_activities: number
}

export interface PointsBreakdownResponse {
  mentee_id: string
  cohort_id: string
  core_points_earned: number
  core_points_available: number
  extra_points: number
  total_points: number
  sessions_attended: number
  sessions_due: number
  sessions_excused: number
  sessions_upcoming: number
}

// `status` is left out on purpose: the PRD says standing labels are never shown
export interface GraduationStatusResponse {
  mentee_id: string
  cohort_id: string
  combined_rate: number
  threshold: number
  warning_threshold: number
  points_to_threshold: number
  is_final: boolean
}

export interface MenteeOverviewResponse {
  cohort_id: string
  points: PointsBreakdownResponse
  graduation: GraduationStatusResponse
  next_session: SessionBrief | null
  open_attendance_windows: number
  pending_override_requests: number
  unread_notifications: number
}

// One row of the mentee's monthly or track attendance
export interface RateBucket {
  key: string
  points_earned: number
  points_available: number
  sessions_attended: number
  sessions_due: number
  rate: number
}

// Rates are percentages, 0 to 100
export interface AttendanceRateResponse {
  mentee_id: string
  cohort_id: string
  core_rate: number
  combined_rate: number
  by_month: RateBucket[]
  by_track: RateBucket[]
  by_session_type: RateBucket[]
}

export type SessionOutcome = 'attended' | 'absent' | 'excused' | 'upcoming'

// One session in the mentee's history, most recent first
export interface SessionPointsEntry {
  session_id: string
  title: string
  starts_at: string
  kami_limu_month: number
  track: string | null
  session_type: SessionType
  points: number
  outcome: SessionOutcome
  points_earned: number
}

export interface ActivityPointsEntry {
  activity_id: string
  type: ActivityType
  title: string
  points_awarded: number
}

export interface PointsDetailResponse extends PointsBreakdownResponse {
  sessions: SessionPointsEntry[]
  extra_activities: ActivityPointsEntry[]
}

// `status` and the at-risk counts are left out on purpose: the PRD says standing labels
// are never shown
export interface MenteeSummary {
  mentee: UserSummary
  ict_track: string | null
  total_points: number
  core_rate: number
  combined_rate: number
  sessions_attended: number
  sessions_due: number
}

export interface GroupOverview {
  cohort_id: string
  mentees: MenteeSummary[]
  average_combined_rate: number
}

export interface MenteeDrilldown {
  summary: MenteeSummary
  points: PointsDetailResponse
  rates: AttendanceRateResponse
  graduation: GraduationStatusResponse
}
