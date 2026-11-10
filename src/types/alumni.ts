// Alumni types. An alumnus sees their past cohort's record, read only.

import type { Pillar } from '@/lib/labels'
import type { AttendanceStatus } from '@/types/attendance'
import type { MenteeActivityCount, MenteeObjectiveRow } from '@/types/peerMentor'

// The final result once the cohort is completed. Before that the API sends standing labels,
// which the PRD keeps off these screens.
export interface FinalStatusResponse {
  status: string
  is_final: boolean
}

export interface AlumniHomeView {
  firstName: string
  cohortName: string
  // True once the cohort's result is final and they graduated
  graduated: boolean
  // ISO date, null when it isn't known. The API has no graduation date, so this is the
  // cohort's end date. See docs/api-gaps.md.
  graduatedOn: string | null
  // Rates are 0 to 100; null when they couldn't be read
  coreRate: number | null
  overallRate: number | null
  totalPoints: number | null
  sessionsAttended: number | null
}

export interface AlumniSessionRow {
  sessionId: string
  title: string
  // ISO date-time
  startsAt: string
  pillar: Pillar | null
  state: AttendanceStatus
}

export type AlumniRecordTab = 'sessions' | 'activities' | 'objectives'

export interface AlumniRecordView {
  cohortName: string
  // Most recent first; null when the history couldn't be read
  sessions: AlumniSessionRow[] | null
  activities: MenteeActivityCount[] | null
  objectives: MenteeObjectiveRow[] | null
}
