// Alumni types. An alumnus sees their past cohort's record, read only.

import type { Pillar } from '@/lib/labels'
import type { AttendanceStatus } from '@/types/attendance'
import type { MenteeActivityCount, MenteeObjectiveRow } from '@/types/peerMentor'
import type { Percentage } from '@/types/rate'

export interface AlumniHomeView {
  firstName: string
  cohortName: string
  // True once the cohort's result is final and they graduated
  graduated: boolean
  // ISO date, null when they didn't graduate or it couldn't be read
  graduatedOn: string | null
  // Rates are 0 to 100; null when they couldn't be read
  coreRate: Percentage | null
  overallRate: Percentage | null
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
