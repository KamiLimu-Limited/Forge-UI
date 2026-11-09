// =============================================================================
// Leaderboard types, mapped directly from the Forge API OpenAPI schema
// =============================================================================

export type LeaderboardDimension =
  | 'core_attendance'
  | 'graduation_rate'
  | 'academic'
  | 'events'
  | 'opportunities'
  | 'consultations'

export interface DimensionEntry {
  rank: number
  mentee_id: string | null
  display_name: string
  is_me: boolean
  value: number
}

export interface DimensionRankingResponse {
  cohort_id: string
  dimension: LeaderboardDimension
  anonymous: boolean
  entries: DimensionEntry[]
}
