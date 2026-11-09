// =============================================================================
// Committee analytics, leaderboard and export shapes, mapped from the Forge API OpenAPI
// schema (/analytics/*, /cohorts/{id}/leaderboard, /exports/*). Status counts the API
// also returns (on track, warning, at risk) are left out: no screen may show them.
// =============================================================================

import type { ActivityType } from '@/types/activity'
import type { CohortHealthResponse, RateBucket } from '@/types/dashboard'

export interface TrendPoint {
  month: number
  sessions: number
  points_earned: number
  points_available: number
  rate: number
}

export interface AttendanceTrendResponse {
  cohort_id: string
  months: TrendPoint[]
}

export interface TrackPerformance {
  track: string
  mentees: number
  bucket: RateBucket
}

export interface TrackPerformanceResponse {
  cohort_id: string
  tracks: TrackPerformance[]
}

export interface SessionQuality {
  session_id: string
  title: string
  starts_at: string
  kami_limu_month: number
  responses: number
  quality: number | null
  usefulness: number | null
  understanding: number | null
  academic_application: number | null
  career_application: number | null
}

export interface SessionQualityResponse {
  cohort_id: string
  overall_quality: number | null
  overall_usefulness: number | null
  sessions: SessionQuality[]
}

export interface ActivityEngagement {
  type: ActivityType
  // Logs per status, for example { pending: 3, approved: 40 }
  counts: Record<string, number>
  points_awarded: number
  mentees_participating: number
}

export interface ActivityEngagementResponse {
  cohort_id: string
  mentees: number
  types: ActivityEngagement[]
}

export interface CohortComparison {
  cohort_id: string
  name: string
  start_date: string
  health: CohortHealthResponse
  activities_per_mentee: number
}

export interface CrossCohortResponse {
  cohorts: CohortComparison[]
}

export interface LeaderboardRow {
  rank: number
  mentee_id: string | null
  display_name: string
  is_me: boolean
  total_points: number
  core_attendance: number
  graduation_rate: number
  academic: number
  events: number
  opportunities: number
  consultations: number
}

export interface LeaderboardResponse {
  cohort_id: string
  anonymous: boolean
  generated_at: string
  entries: LeaderboardRow[]
}

// CSV downloads the committee can take
export type ExportKind = 'leaderboard' | 'attendance' | 'full-report'
