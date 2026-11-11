// Dashboard types, mapped directly from the Forge API OpenAPI schema

import type { ActivityType, ExtraActivityResponse } from '@/types/activity'
import type { ObjectiveResponse } from '@/types/objective'
import type { SessionBrief, SessionType, UserSummary } from '@/types/session'
import type { Percentage } from '@/types/rate'

export interface CohortHealthResponse {
  cohort_id: string
  total_mentees: number
  average_core_rate: Percentage
  average_overall_rate: Percentage
  points_distributed: number
  sessions_completed: number
  sessions_scheduled: number
  pending_override_requests: number
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
  sessions_absent: number
  // Not submitted before the window closed
  sessions_missed: number
  points_missed: number
  sessions_excused: number
  // Still to come
  sessions_remaining: number
  points_remaining: number
}

// `status` is only set once graduation is confirmed
export interface GraduationStatusResponse {
  mentee_id: string
  cohort_id: string
  status: 'graduated' | 'not_graduated' | null
  core_rate: Percentage
  overall_rate: Percentage
  threshold: number
  points_to_threshold: number
  is_final: boolean
}

export interface MenteeOverviewResponse {
  cohort_id: string
  points: PointsBreakdownResponse
  core_rate: Percentage
  overall_rate: Percentage
  graduation_threshold: number
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
  rate: Percentage
}

// Rates are percentages, 0 to 100
export interface AttendanceRateResponse {
  mentee_id: string
  cohort_id: string
  core_rate: Percentage
  // Core plus extra-activity points
  overall_rate: Percentage
  by_month: RateBucket[]
  by_track: RateBucket[]
  by_session_type: RateBucket[]
}

export type SessionOutcome = 'present' | 'absent' | 'missed' | 'excused' | 'remaining'

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

export interface MenteeSummary {
  mentee: UserSummary
  ict_track: string | null
  total_points: number
  core_rate: Percentage
  overall_rate: Percentage
  sessions_attended: number
  sessions_due: number
}

export interface GroupOverview {
  cohort_id: string
  mentees: MenteeSummary[]
  average_core_rate: Percentage
  average_overall_rate: Percentage
}

export interface MenteeDrilldown {
  summary: MenteeSummary
  points: PointsDetailResponse
  rates: AttendanceRateResponse
  graduation: GraduationStatusResponse
  objectives: ObjectiveResponse[]
  session_feedback: MenteeSessionFeedback[]
  recent_activities: ExtraActivityResponse[]
}

// One of the mentee's own session ratings, as their peer mentor sees it
export interface MenteeSessionFeedback {
  session: SessionBrief
  ratings: (number | null)[] | null
  feedback: string | null
  submitted_at: string | null
}
