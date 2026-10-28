// =============================================================================
// Cohort types, mapped directly from the Forge API OpenAPI schema
// =============================================================================

import type { PageParams } from '@/types/page'
import type { SessionResponse } from '@/types/session'

export type CohortStatus = 'draft' | 'active' | 'completed'

export type ProgrammeType = 'undergraduate' | 'postgraduate'

export interface MonthBoundary {
  month: number
  name?: string | null
  // ISO dates (YYYY-MM-DD)
  start: string
  end: string
}

export interface RatingWindow {
  opens_at: string
  closes_at: string
}

export interface CohortResponse {
  id: string
  name: string
  programme_type: ProgrammeType
  start_date: string
  end_date: string
  graduation_threshold: number
  status: CohortStatus
  kami_limu_month_boundaries: MonthBoundary[] | null
  ict_tracks_offered: string[] | null
  skill_names: string[] | null
  skill_rating_windows: Record<string, RatingWindow> | null
  leaderboard_anonymous: boolean
  peer_mentorship_deadline_hours: number | null
  created_at: string
  updated_at: string
}

export interface CohortDetailResponse extends CohortResponse {
  // Enrolled people per role, keyed by UserRole
  enrollment_counts: Record<string, number>
}

export interface CohortCreateRequest {
  name: string
  programme_type: ProgrammeType
  start_date: string
  end_date: string
  graduation_threshold?: number
  status?: CohortStatus
  kami_limu_month_boundaries?: MonthBoundary[] | null
  ict_tracks_offered?: string[] | null
  skill_names?: string[] | null
  skill_rating_windows?: Record<string, RatingWindow> | null
  leaderboard_anonymous?: boolean | null
  peer_mentorship_deadline_hours?: number | null
}

export type CohortUpdateRequest = Partial<CohortCreateRequest>

export interface CohortListParams extends PageParams {
  status?: CohortStatus
  programme_type?: ProgrammeType
  search?: string
}

export interface CalendarMonth {
  month: number
  name: string | null
  sessions: SessionResponse[]
}
