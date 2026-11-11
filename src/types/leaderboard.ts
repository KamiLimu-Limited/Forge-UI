// Leaderboard types, mapped directly from the Forge API OpenAPI schema

export type LeaderboardDimension =
  | 'core_attendance'
  | 'academic'
  | 'events'
  | 'applications'
  | 'consultations'

export type PeerMentorDimension =
  | 'sessions_attended'
  | 'extra_sessions'
  | 'core_rate'
  | 'overall_rate'

export interface PeerMentorRow {
  rank: number
  peer_mentor_id: string
  display_name: string
  is_me: boolean
  sessions_attended: number
  extra_sessions: number
  core_rate: number
  overall_rate: number
}

export interface PeerMentorLeaderboardResponse {
  cohort_id: string
  ranked_by: PeerMentorDimension
  generated_at: string
  entries: PeerMentorRow[]
}

export type LeaderboardKind = 'mentee' | 'peer_mentor'

export interface LeaderboardSnapshotResponse {
  id: string
  cohort_id: string
  kind: LeaderboardKind
  taken_at: string
  // User id of who took it
  taken_by: string | null
  rows: Record<string, unknown>[]
}

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
  entries: DimensionEntry[]
}
