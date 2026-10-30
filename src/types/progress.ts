import type { Pillar } from '@/lib/labels'

// The rows on the mentee progress screen. The screen's hook builds them from the
// API's monthly and track rate buckets, so the components don't depend on the API shape.

export interface MonthProgressRow {
  // "Month 1", or "Month 5 (so far)" for the month in progress
  label: string
  attended: number
  scheduled: number
  // Percentage, 0 to 100
  rate: number
}

export interface TrackProgressRow {
  label: string
  // null for rows that aren't one pillar, such as "Core sessions"
  pillar: Pillar | null
  attended: number
  scheduled: number
  points: number
  // Whole percentage, 0 to 100
  rate: number
}

export interface ProgressSummary {
  attended: number
  scheduled: number
  points: number
}
