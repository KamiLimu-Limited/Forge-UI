import type { AttendanceStatus } from '@/types/attendance'
import type { SessionRating } from '@/types/menteeSessions'

// What a peer mentor may see of a mentee. Email, phone and standing labels stay out of these
// types, so a screen can't show them by accident.

export interface MenteeCardView {
  id: string
  name: string
  coreRate: number
  overallRate: number
  points: number
}

export interface MenteeAttendanceRow {
  sessionId: string
  title: string
  // ISO date-time
  startsAt: string
  state: AttendanceStatus
}

export interface MenteeObjectiveRow {
  skill: string
  label: string
  // "Start 2, Mid not yet rated"
  summary: string
}

export interface MenteeActivityCount {
  label: string
  count: number
}

export interface MenteeFeedbackRow {
  sessionId: string
  title: string
  ratings: SessionRating[]
  feedback: string | null
}

export interface MenteeDetailView {
  card: MenteeCardView
  attendance: MenteeAttendanceRow[]
  // null when the mentee's ratings couldn't be read
  objectives: MenteeObjectiveRow[] | null
  activities: MenteeActivityCount[]
  // null when the group's records couldn't be read
  feedback: MenteeFeedbackRow[] | null
}
