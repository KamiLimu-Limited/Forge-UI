// =============================================================================
// ICT peer mentor types. The API shapes come from the Forge API OpenAPI schema; the views
// are what the screens draw.
// =============================================================================

import type { RateBucket } from '@/types/dashboard'
import type { SessionBrief, UserSummary } from '@/types/session'

// Status labels come back too, but the PRD keeps standing labels off peer mentor screens,
// so they're left out here
export interface TrackMenteeEntry {
  mentee: UserSummary
  track: RateBucket
  combined_rate: number
}

export interface TrackOverviewResponse {
  cohort_id: string
  track: string
  mentees: TrackMenteeEntry[]
}

export interface TrackSessionEntry {
  session: SessionBrief
  attended: number
  eligible: number
  responses: number
  average_quality: number | null
}

export interface TrackMenteeRow {
  id: string
  name: string
  // "7 of 7"
  attendedLabel: string
  points: number
}

export interface TrackSessionBrief {
  title: string
  // ISO date-times
  startsAt: string
  endsAt: string
}

export interface MyTrackView {
  track: string
  menteeCount: number
  // ICT session attendance across the track, 0 to 100; null before any session
  attendanceRate: number | null
  sessionsSoFar: number
  nextSession: TrackSessionBrief | null
  // Most ICT sessions attended first
  mentees: TrackMenteeRow[]
}

export interface TrackSessionRow extends TrackSessionBrief {
  id: string
  isToday: boolean
  // "13 of 14", null when attendance isn't known yet
  attendedLabel: string | null
  materialsUrl: string | null
}

export interface TrackSessionsView {
  track: string
  menteeCount: number
  // Today and past sessions, newest first
  sessions: TrackSessionRow[]
  next: TrackSessionBrief | null
}
