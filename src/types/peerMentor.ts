import type { Pillar } from '@/lib/labels'
import type { AttendanceStatus } from '@/types/attendance'
import type { SessionRating } from '@/types/menteeSessions'
import type { Percentage } from '@/types/rate'

// What a peer mentor may see of a mentee. Email, phone and standing labels stay out of these
// types, so a screen can't show them by accident.

export interface MenteeCardView {
  id: string
  name: string
  coreRate: Percentage
  overallRate: Percentage
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
  id: string
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

// The peer mentorship session a peer mentor's group is on now, or just had
export interface PeerSessionView {
  id: string
  title: string
  // ISO date-times
  startsAt: string
  endsAt: string
  // "Closes in 2h" while attendance is open, "Closed" after, null before it opens
  windowLabel: string | null
  isOpen: boolean
  // Mentees who have sent their attendance, ratings and feedback
  submitted: number
  groupSize: number
}

export interface FeedbackQuestionView {
  label: string
  // Average out of 5, null when nobody has answered yet
  average: number | null
}

export interface FeedbackGroupView {
  // "Reaction", "Learning" or "Intended behaviour"
  label: string
  questions: FeedbackQuestionView[]
}

// What a peer mentor's own group said about one session. No names: feedback stays anonymous.
export interface GroupFeedbackView {
  id: string
  title: string
  // ISO date-times
  startsAt: string
  endsAt: string
  // "Window closes Thu 27 Aug, 12:00 PM" or "Window closed …", null when unknown
  windowLine: string | null
  submitted: number
  groupSize: number
  // Average of every answer, out of 5
  average: number | null
  groups: FeedbackGroupView[]
  feedback: string[]
}

export interface FacilitatorSessionRow {
  id: string
  title: string
  // ISO date-time
  startsAt: string
  // Attendance is still open, so ratings are still coming in
  isInProgress: boolean
  // Average of everyone who attended and rated it, out of 5; null when nobody has
  rating: number | null
  responses: number
}

export interface RatingPointView {
  // Short name for the chart axis, such as "PM 3"
  label: string
  title: string
  rating: number
}

// The peer mentorship sessions a peer mentor has run with their group, and how they were rated.
// Worked out from the group's own answers. See docs/api-gaps.md.
export interface FacilitatorView {
  completed: number
  inProgress: number
  // Average of the completed sessions' ratings
  average: number | null
  // Across every peer mentor in the cohort, for comparison
  peerAverage: number | null
  best: FacilitatorSessionRow | null
  // Newest first
  sessions: FacilitatorSessionRow[]
  // Completed and rated, oldest first
  trend: RatingPointView[]
}

// One session the peer mentor led or co-led, as rated by everyone who attended it
export interface MentoredSessionRatings {
  id: string
  title: string
  // ISO date-time
  startsAt: string
  pillar: Pillar | null
  responses: number
  // Average of the question averages, out of 5
  average: number | null
  groups: FeedbackGroupView[]
  feedback: string[]
}

export interface SessionRatingsView {
  session: MentoredSessionRatings
  // The peer mentor's average across all their completed sessions
  averageAcrossSessions: number | null
  // Across every peer mentor in the cohort
  peerAverage: number | null
}

export type MeetingMode = 'physical' | 'virtual'

// The peer mentorship session a group meeting is being set for
export interface GroupMeetingView {
  sessionId: string
  title: string
  // "Open Mon 17 Aug to Thu 27 Aug, 12:00 PM"
  windowLine: string
  // The first and last day the group can meet, as YYYY-MM-DD for the date field
  firstDay: string
  lastDay: string
  // The peer mentor's group, by name
  group: { id: string; name: string }[]
}
