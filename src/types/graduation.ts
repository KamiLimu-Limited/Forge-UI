// Graduation. The API has only GET /cohorts/{id}/graduation-report, so the preview is
// built from it. Confirming, the sequence data, corrections and closing aren't in the API
// yet (see docs/api-gaps.md). Status labels other than graduated or not are never shown.

import type { UserSummary } from '@/types/session'
import type { Percentage } from '@/types/rate'

export type GraduationReportStatus =
  | 'on_track'
  | 'warning'
  | 'at_risk'
  | 'graduated'
  | 'not_graduated'

export interface GraduationReportEntry {
  mentee: UserSummary
  peer_mentor_id: string | null
  ict_track: string | null
  total_points: number
  core_rate: Percentage
  combined_rate: Percentage
  status: GraduationReportStatus
}

export interface GraduationReportResponse {
  cohort_id: string
  threshold: number
  generated_at: string
  counts: Record<string, number>
  mentees: GraduationReportEntry[]
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
  // When the report was worked out
  calculatedAt: string
  threshold: number
  graduates: GraduateRow[]
  nonGraduates: GraduateRow[]
}

export interface ProgramLeadHomeView {
  graduation: { endDate: string; hasEnded: boolean; isGraduated: boolean }
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
  // ISO date. The API has no graduation date (gap M43), so this is the cohort's end date.
  graduatedOn: string
  // 0 to 100
  coreRate: Percentage | null
  overallRate: Percentage | null
  totalPoints: number | null
  sessionsAttended: number | null
  threshold: number
}
