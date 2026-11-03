import type { Pillar } from '@/lib/labels'
import type { MonthProgressRow } from '@/types/progress'

// The data the mentee home screen draws. The screen's hook builds it from the API,
// so the components don't depend on the API shape.

export interface HomeStanding {
  // Whole percentages, 0 to 100. null until there is something to measure.
  coreRate: number | null
  overallRate: number | null
  pointsEarned: number
  pointsPossible: number
}

export interface SessionBuckets {
  attended: number
  inProgress: number
  missed: number
  remaining: number
}

export interface NextSession {
  id: string
  title: string
  // ISO date-times
  startsAt: string
  // null when only the short session record could be loaded
  endsAt: string | null
  pillar: Pillar | null
  materialsUrl: string | null
}

// A past session whose attendance form is still open
export interface OpenSession {
  id: string
  title: string
  // ISO date-times
  startsAt: string
  endsAt: string
  pillar: Pillar | null
  // The peer mentor or mentor who led it
  leaderName: string | null
  points: number
  // "Closes in 2h". The hook builds it so this screen stays free of timers.
  closesInLabel: string
}

export interface LeaderboardRank {
  // "Core attendance", "Academic" and so on
  label: string
  // null means nothing logged yet on this board
  rank: number | null
  isTied: boolean
}

export interface TrackPrompt {
  // YYYY-MM-DD
  closesOn: string
}

export interface MenteeHomeData {
  firstName: string
  // null when the cohort's month dates aren't available
  programmeMonth: number | null
  totalMonths: number | null
  peerMentorName: string | null
  // True when a peer mentor is assigned, even if the API can't tell us their name
  hasPeerMentor: boolean
  // Set while the mentee still has to choose an ICT track
  trackPrompt: TrackPrompt | null
  standing: HomeStanding
  buckets: SessionBuckets
  nextSession: NextSession | null
  openSessions: OpenSession[]
  months: MonthProgressRow[]
  ranks: LeaderboardRank[]
}
