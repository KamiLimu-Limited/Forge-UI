// Leaderboard display rules: the shortened list, values and the mentee's own line

import { formatPercentage } from '@/lib/format'
import { RANK_BOARDS } from '@/lib/menteeDashboard'
import { ordinal } from '@/lib/ordinal'
import type { DimensionEntry, LeaderboardDimension } from '@/types/leaderboard'

const TOP_COUNT = 6
// Lists this short show everyone
const SHORT_LIST_MAX = 10

export interface LeaderboardSlice {
  rows: DimensionEntry[]
  // The row after which entries are left out
  gapAfter: string | null
}

export function leaderboardRowKey(entry: DimensionEntry): string {
  return entry.mentee_id ?? `${entry.rank}-${entry.display_name}`
}

// The top of the board, plus the mentee with the people either side of them
export function leaderboardSlice(entries: DimensionEntry[], showAll: boolean): LeaderboardSlice {
  if (showAll || entries.length <= SHORT_LIST_MAX) return { rows: entries, gapAfter: null }
  const myIndex = entries.findIndex((entry) => entry.is_me)
  const top = entries.slice(0, TOP_COUNT)
  if (myIndex < 0) return { rows: top, gapAfter: null }
  const from = Math.max(TOP_COUNT, myIndex - 1)
  const nearMe = entries.slice(from, myIndex + 2)
  return {
    rows: [...top, ...nearMe],
    gapAfter: from > TOP_COUNT ? leaderboardRowKey(top[top.length - 1]) : null,
  }
}

export function dimensionLabel(dimension: LeaderboardDimension): string {
  return RANK_BOARDS.find((board) => board.dimension === dimension)?.label ?? dimension
}

export function valueHeading(dimension: LeaderboardDimension): string {
  return dimension === 'core_attendance' ? 'Core attendance rate' : 'Logged'
}

export function formatBoardValue(dimension: LeaderboardDimension, value: number): string {
  return dimension === 'core_attendance' ? (formatPercentage(value) ?? '') : String(value)
}

// "You're 12th on core attendance.", or a note when nothing is logged
export function myStanding(
  entries: DimensionEntry[],
  dimension: LeaderboardDimension
): string | null {
  const mine = entries.find((entry) => entry.is_me)
  if (!mine) return null
  const label = dimensionLabel(dimension).toLowerCase()
  if (mine.value === 0) return `You have nothing logged for ${label} yet.`
  const isTied = entries.filter((entry) => entry.rank === mine.rank).length > 1
  return `You're ${isTied ? 'tied ' : ''}${ordinal(mine.rank)} on ${label}.`
}
