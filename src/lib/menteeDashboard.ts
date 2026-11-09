// =============================================================================
// Turns the mentee API responses into the rows the mentee screens draw.
// The backend computes every rate and point value; these only reshape them.
// =============================================================================

import type { PointsBreakdownResponse, RateBucket } from '@/types/dashboard'
import type { LeaderboardRank, SessionBuckets } from '@/types/home'
import type { LeaderboardDimension, DimensionRankingResponse } from '@/types/leaderboard'
import type { MonthProgressRow, ProgressSummary, TrackProgressRow } from '@/types/progress'

const CORE_KEY = 'core'
const ICT_KEY = 'ict'

export const RANK_BOARDS: Array<{ dimension: LeaderboardDimension; label: string }> = [
  { dimension: 'core_attendance', label: 'Core attendance' },
  { dimension: 'academic', label: 'Academic' },
  { dimension: 'events', label: 'Events' },
  { dimension: 'opportunities', label: 'Applications' },
  { dimension: 'consultations', label: 'Consultations' },
]

// The month number in a bucket key, which may be "3" or "month-3"
function monthNumber(key: string): number | null {
  const match = /\d+/.exec(key)
  return match ? Number(match[0]) : null
}

export function monthRows(buckets: RateBucket[], currentMonth: number | null): MonthProgressRow[] {
  return buckets
    .map((bucket) => ({ bucket, month: monthNumber(bucket.key) }))
    .sort((a, b) => (a.month ?? 0) - (b.month ?? 0))
    .map(({ bucket, month }) => ({
      label:
        month === null ? bucket.key : `Month ${month}${month === currentMonth ? ' (so far)' : ''}`,
      attended: bucket.sessions_attended,
      scheduled: bucket.sessions_due,
      rate: bucket.rate,
    }))
}

export function trackRows(buckets: RateBucket[]): TrackProgressRow[] {
  return buckets.map((bucket) => {
    const key = bucket.key.toLowerCase()
    const isCore = key === CORE_KEY
    return {
      label: isCore ? 'Core sessions' : key === ICT_KEY ? 'ICT' : bucket.key,
      pillar: isCore ? null : 'ict',
      attended: bucket.sessions_attended,
      scheduled: bucket.sessions_due,
      points: bucket.points_earned,
      rate: bucket.rate,
    }
  })
}

export function sessionBuckets(
  points: PointsBreakdownResponse,
  openWindows: number,
  // The API's sessions_upcoming means started and not submitted, not still to come
  remaining: number
): SessionBuckets {
  return {
    attended: points.sessions_attended,
    inProgress: openWindows,
    missed: Math.max(0, points.sessions_due - points.sessions_attended - points.sessions_excused),
    remaining,
  }
}

export function progressSummary(points: PointsBreakdownResponse): ProgressSummary {
  return {
    attended: points.sessions_attended,
    scheduled: points.sessions_due,
    points: points.total_points,
  }
}

// A nil board (the request failed) or a zero value counts as nothing logged yet
export function rankFor(label: string, board: DimensionRankingResponse | null): LeaderboardRank {
  const mine = board?.entries.find((entry) => entry.is_me)
  if (!board || !mine || mine.value === 0) return { label, rank: null, isTied: false }
  const sharing = board.entries.filter((entry) => entry.rank === mine.rank).length
  return { label, rank: mine.rank, isTied: sharing > 1 }
}

// "Closes in 2h", "Closes in 25m"
export function closesInLabel(closesAt: string, now: Date = new Date()): string {
  const minutes = Math.max(0, Math.round((new Date(closesAt).getTime() - now.getTime()) / 60000))
  if (minutes < 60) return `Closes in ${minutes}m`
  if (minutes < 48 * 60) return `Closes in ${Math.round(minutes / 60)}h`
  return `Closes in ${Math.round(minutes / (24 * 60))}d`
}
