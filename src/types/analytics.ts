// Committee analytics, leaderboard and export shapes, mapped from the Forge API OpenAPI
// schema (/analytics/*, /cohorts/{id}/leaderboard, /exports/*).

import type { ActivityType } from '@/types/activity'
import type { CohortHealthResponse, RateBucket } from '@/types/dashboard'
import type { Percentage } from '@/types/rate'
import type { QuestionAverage } from '@/types/sessionFeedback'

export interface TrendPoint {
  month: number
  sessions: number
  points_earned: number
  points_available: number
  rate: Percentage
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
  // Across all nine questions
  average: number | null
  questions: QuestionAverage[]
}

export interface SessionQualityResponse {
  cohort_id: string
  overall_average: number | null
  questions: QuestionAverage[]
  sessions: SessionQuality[]
}

export interface ActivityEngagement {
  type: ActivityType
  // Logs per status, for example { active: 40, reversed: 1 }
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
  academic: number
  events: number
  // Job and scholarship applications together
  applications: number
  consultations: number
}

export interface LeaderboardResponse {
  cohort_id: string
  generated_at: string
  entries: LeaderboardRow[]
}

// CSV downloads the committee can take
export type ExportKind = 'leaderboard' | 'peer-leaderboard' | 'attendance' | 'full-report'

// One saved leaderboard, as the snapshots card lists it
export interface SnapshotRow {
  id: string
  // "Mentee leaderboard"
  label: string
  takenAt: string
}
