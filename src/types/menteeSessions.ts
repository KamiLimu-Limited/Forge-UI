import type { Pillar } from '@/lib/labels'
import type { AttendanceRatings, AttendanceStatus, OverrideRequestStatus } from '@/types/attendance'
import type { OpenSession } from '@/types/home'
import type { SessionType } from '@/types/session'

// The data the mentee sessions screens draw. Their hooks build it from the API,
// so the components don't depend on the API shape.

export interface UpcomingSession {
  id: string
  title: string
  // ISO date-times
  startsAt: string
  endsAt: string
  pillar: Pillar | null
  // "Today" or "Thu 3 Sep"
  dayLabel: string
  // "Opens at 5:30 PM" or "Opens Thu 3 Sep, 5:30 PM"
  opensLabel: string
}

export interface MenteeSessionsData {
  // "Month 5 of 8", or null when the cohort's month dates aren't available
  monthLine: string | null
  open: OpenSession[]
  upcoming: UpcomingSession[]
}

export interface SessionRating {
  label: string
  value: number
}

export interface HistoryRow {
  sessionId: string
  title: string
  // ISO date-times. endsAt is null when only the short session record could be loaded.
  startsAt: string
  endsAt: string | null
  month: number
  pillar: Pillar | null
  // The ICT track name, for ICT sessions
  track: string | null
  sessionType: SessionType
  state: AttendanceStatus
  pointsEarned: number
  ratings: SessionRating[]
  feedback: string | null
  notes: string | null
  materialsUrl: string | null
}

export interface MenteeHistoryData {
  monthLine: string | null
  rows: HistoryRow[]
}

export interface HistoryFilters {
  month: string
  track: string
  state: string
  type: string
}

export type RatingField = keyof AttendanceRatings

export type WindowState = 'open' | 'upcoming' | 'closed'

export interface AttendanceAnswers {
  status: 'attended' | 'not_attended'
  ratings: Partial<Record<RatingField, number>>
  feedback: string
}

// The form while it's being filled in: nothing is picked for attendance until the mentee does
export interface AttendanceDraft extends Omit<AttendanceAnswers, 'status'> {
  status: AttendanceAnswers['status'] | null
}

// One session as the attendance and notes screens draw it
export interface SessionRecordView {
  id: string
  title: string
  // ISO date-times
  startsAt: string
  endsAt: string
  pillar: Pillar | null
  leaderName: string | null
  points: number
  materialsUrl: string | null
  windowState: WindowState
  // "Thu 27 Aug, 12:00 PM", or null when the session has no window
  windowClosesLabel: string | null
  closesInLabel: string | null
  // "Opens at 5:30 PM" or "Opens Thu 3 Sep, 5:30 PM"
  opensLabel: string
  // The mentee's attendance record, if they have one
  recordId: string | null
  recordState: AttendanceStatus | null
  notes: string | null
  // ISO date-time of the last save
  savedAt: string | null
}

export interface ExtensionRequestView {
  status: OverrideRequestStatus
  // ISO date-time
  sentAt: string
  // The System Admin's reason, when denied
  reviewReason: string | null
}

export interface ExtensionView {
  session: SessionRecordView
  // The mentee's latest request for this session
  request: ExtensionRequestView | null
}

export interface SessionPersonView {
  name: string
  // "Lead mentor" or "Co-mentor"
  roleLabel: string
}

export interface SessionMaterialView {
  url: string
  title: string
  // "Google Drive folder"
  kindLabel: string
}

// Everything the session detail screen shows, on top of the attendance view
export interface SessionDetailView extends SessionRecordView {
  isVirtual: boolean
  // "Virtual", or the venue for a physical session
  whereLabel: string
  typeLabel: string
  month: number
  // "Today, starts in 2 hours", or null once it has started
  startsSoonLabel: string | null
  // "Moved from Thu 20 Aug, 5:30 PM. Reason from the System Admin: …"
  movedNote: string | null
  mentors: SessionPersonView[]
  materials: SessionMaterialView[]
}
