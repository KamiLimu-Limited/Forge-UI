// A professional mentor's sessions (GET /dashboard/professional-mentor/sessions), their
// feedback (GET /sessions/{id}/feedback) and materials (PATCH /sessions/{id}/resources).
// Feedback is anonymous: respondents are numbered, never named.

import type { Pillar } from '@/lib/labels'
import type { FeedbackGroupView } from '@/types/peerMentor'
import type { MentorRole, SessionBrief } from '@/types/session'
import type { FeedbackEntry, QuestionAverage } from '@/types/sessionFeedback'

export interface SessionAttendanceSummary {
  session: SessionBrief
  eligible: number
  attended: number
  responses: number
  average_quality: number | null
  question_averages: QuestionAverage[]
}

// A session the caller led or co-led, with its average across the nine questions
export interface FacilitatedSession {
  session: SessionBrief
  responses: number
  average: number | null
}

export interface FacilitatorSummary {
  cohort_id: string
  sessions_completed: number
  sessions_in_progress: number
  average: number | null
  best_rated_session: FacilitatedSession | null
}

export interface RatingTrendPoint {
  session_id: string
  title: string
  starts_at: string
  average: number | null
}

export interface PeerMentorAverage {
  cohort_id: string
  peer_mentors: number
  average: number | null
}

// One session's ratings: each question's average and the written feedback
export interface SessionRatings {
  session: SessionBrief
  responses: number
  average: number | null
  questions: QuestionAverage[]
  feedback: FeedbackEntry[]
}

export interface ProSessionRow {
  id: string
  title: string
  // ISO date-times
  startsAt: string
  endsAt: string | null
  pillar: Pillar | null
  // null when the session detail couldn't be read
  role: MentorRole | null
  statusLabel: string | null
  attended: number
  eligible: number
  // Average quality rating out of 5, null when nobody rated it
  rating: number | null
  materialsUrl: string | null
}

export interface ProSessionsView {
  cohortName: string | null
  upcoming: ProSessionRow[]
  past: ProSessionRow[]
}

export interface ProFeedbackEntry {
  // "Participant 01", numbered within the session
  label: string
  text: string
}

export interface ProFeedbackView {
  session: ProSessionRow
  responses: number
  average: number | null
  groups: FeedbackGroupView[]
  feedback: ProFeedbackEntry[]
}
