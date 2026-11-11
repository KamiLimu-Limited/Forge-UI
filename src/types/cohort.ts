// Cohort types, mapped directly from the Forge API OpenAPI schema

import type { ActivityType } from '@/types/activity'
import type { PageParams } from '@/types/page'
import type { SessionResponse, UserSummary } from '@/types/session'

export type CohortStatus = 'draft' | 'active' | 'completed' | 'archived'

export type ProgrammeType = 'undergraduate' | 'postgraduate'

export interface MonthBoundary {
  month: number
  name?: string | null
  // ISO dates (YYYY-MM-DD)
  start: string
  end: string
}

export type RatingPoint = 'start' | 'mid' | 'end'

export interface TimeWindow {
  opens_at: string
  closes_at: string
}

export type ObjectiveWindows = Partial<Record<RatingPoint, TimeWindow>>

export interface IctTrackResponse {
  id: string
  name: string
  description: string | null
  lead_mentor: UserSummary | null
}

export interface IctTrackEntry {
  name: string
  description?: string | null
  lead_mentor_id?: string | null
}

export interface IctTracksRequest {
  tracks: IctTrackEntry[]
}

export interface StagePoints {
  applied: number
  general_interview: number
  technical_interview: number
  final_interview: number
  offer_made: number
}

// Points per extra activity type. Job (`opportunity`) and scholarship applications earn by
// stage. Targets are the logs per type each mentee aims for.
export interface PointsConfig {
  academic: number
  event: number
  consultation: number
  opportunity: StagePoints
  scholarship: StagePoints
  targets: Partial<Record<ActivityType, number>>
}

export interface TrackSelectionWindow {
  opens_at: string | null
  closes_at: string | null
  is_open: boolean
}

export interface TrackSelectionResponse {
  window: TrackSelectionWindow
  ict_track: string | null
}

export interface TrackOverrideRequest {
  ict_track: string
  reason?: string | null
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
  // Hours the attendance window stays open after a session ends
  thursday_window_hours: number
  saturday_window_hours: number
  objective_windows: ObjectiveWindows | null
  // Days after an activity in which it can still be logged
  extra_log_window_days: number
  track_selection_opens_at: string | null
  track_selection_closes_at: string | null
  is_imported: boolean
  closed_at: string | null
  archived_at: string | null
  created_at: string
  updated_at: string
}

export interface CohortDetailResponse extends CohortResponse {
  ict_tracks: IctTrackResponse[]
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
  thursday_window_hours?: number | null
  saturday_window_hours?: number | null
  objective_windows?: ObjectiveWindows | null
  extra_log_window_days?: number | null
  track_selection_opens_at?: string | null
  track_selection_closes_at?: string | null
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
