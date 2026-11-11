// Graduation. The API has only GET /cohorts/{id}/graduation-report, so the preview is
// built from it. Confirming, the sequence data, corrections and closing aren't in the API
// yet (see docs/api-gaps.md). Status labels other than graduated or not are never shown.

import type { UserRole } from '@/types/auth'
import type { UserSummary } from '@/types/session'
import type { Percentage } from '@/types/rate'

// Null until graduation is confirmed
export type GraduationReportStatus = 'graduated' | 'not_graduated'

export interface GraduationReportEntry {
  mentee: UserSummary
  peer_mentor_id: string | null
  ict_track: string | null
  total_points: number
  core_rate: Percentage
  overall_rate: Percentage
  status: GraduationReportStatus | null
}

export interface GraduationReportResponse {
  cohort_id: string
  threshold: number
  generated_at: string
  counts: Record<string, number>
  mentees: GraduationReportEntry[]
}

// One mentee's result as the graduation routes give it
export interface GraduationEntry {
  mentee: UserSummary
  core_rate: Percentage
  overall_rate: Percentage
  core_points: number
  extra_points: number
  total_points: number
  graduated: boolean
}

// GET and POST /cohorts/{id}/graduation/preview: the calculation, nothing frozen
export interface GraduationPreview {
  cohort_id: string
  threshold: number
  computed_at: string
  graduates: GraduationEntry[]
  non_graduates: GraduationEntry[]
}

// GET /cohorts/{id}/graduation: the confirmed, frozen result
export interface GraduationRecord {
  cohort_id: string
  threshold: number
  confirmed_at: string
  // User id of the Program Lead who confirmed it
  confirmed_by: string | null
  graduates: GraduationEntry[]
  non_graduates: GraduationEntry[]
}

// GET /dashboard/program-lead/graduation
export interface GraduationPanel {
  cohort_id: string
  preview: GraduationPreview
  confirmed: boolean
  confirmed_at: string | null
  availability: {
    available: boolean
    // Why Graduate cohort isn't available, in plain sentences
    reasons: string[]
  }
}

export interface GraduationSequenceResponse {
  cohort_id: string
  cohort_name: string
  // In reveal order
  graduates: GraduationEntry[]
  stats: {
    mentees: number
    graduates: number
    sessions_held: number
    points_distributed: number
    average_core_rate: Percentage
  }
  mentors: { user: UserSummary; roles: UserRole[] }[]
}

export interface GraduationCorrectionRequest {
  user_id: string
  graduated: boolean
  reason: string
}

export interface GraduationCorrectionResponse {
  id: string
  result_id: string
  field: string
  old_value: string
  new_value: string
  reason: string
  corrected_by: string | null
  created_at: string
}

// GET /users/me/graduation-card, for graduates
export interface GraduationCard {
  cohort: { id: string; name: string; status: string }
  // YYYY-MM-DD
  graduated_on: string
  core_rate: Percentage
  overall_rate: Percentage
  total_points: number
}

// GET /alumni/me/history: one finished cohort and the frozen result
export interface AlumniCohort {
  cohort: { id: string; name: string; status: string }
  roles: UserRole[]
  // null for a cohort they didn't take part in as a mentee
  result: GraduationEntry | null
}

export interface GraduateRow {
  id: string
  name: string
  // null until the API has universities (gap 14)
  university: string | null
  coreRate: Percentage
  totalPoints: number
}

export interface GraduationPreviewView {
  cohortId: string
  cohortName: string
  // YYYY-MM-DD
  endDate: string
  hasEnded: boolean
  // The cohort is completed, so the results are final
  isGraduated: boolean
  // Closed after graduation; read only from then on
  isClosed: boolean
  // When the preview was worked out, or when graduation was confirmed
  calculatedAt: string
  confirmedAt: string | null
  // null before graduation, or when the name couldn't be looked up
  confirmedByName: string | null
  threshold: number
  graduates: GraduateRow[]
  nonGraduates: GraduateRow[]
  // Why Graduate cohort isn't available yet; empty when it is, null when unknown
  unavailableReasons: string[] | null
}

export interface ProgramLeadHomeView {
  graduation: {
    endDate: string
    hasEnded: boolean
    isGraduated: boolean
    // Graduate cohort can be confirmed now
    isAvailable: boolean
    // Why not, from the graduation panel
    reasons: string[]
  }
  pendingRequests: { id: string; menteeName: string; sessionLine: string }[]
  pendingTotal: number
  upcoming: { id: string; title: string; startsAt: string; isVirtual: boolean }[]
}

// One part of the graduation sequence, in playing order
export type SequenceStep =
  | { kind: 'opening' }
  | { kind: 'numbers' }
  | { kind: 'reveal'; index: number }
  | { kind: 'mentors' }
  | { kind: 'closing' }

export interface SequenceMentor {
  name: string
  // "1:1 Peer Mentor", "ICT Peer Mentor, Cloud Engineering" or the session they led
  role: string
}

export interface SequenceView {
  cohortName: string
  // YYYY-MM-DD
  startDate: string
  endDate: string
  months: number
  numbers: { label: string; value: number }[]
  // In reveal order. Mentees who didn't graduate are never here.
  graduates: GraduateRow[]
  mentors: SequenceMentor[]
  // True while it plays from the live report, before a confirmed graduation exists
  isRehearsal: boolean
}

// A mentee's own final result, once their cohort's graduation is final
export interface GraduationResultView {
  firstName: string
  cohortName: string
  graduated: boolean
  // ISO date: the graduation date for a graduate, otherwise the cohort's end date
  graduatedOn: string
  // 0 to 100
  coreRate: Percentage | null
  overallRate: Percentage | null
  totalPoints: number | null
  sessionsAttended: number | null
  threshold: number
}
