'use client'

import { api } from '@/lib/api'
import { monthRows, progressSummary, trackRows } from '@/lib/menteeDashboard'
import type { MonthProgressRow, ProgressSummary, TrackProgressRow } from '@/types/progress'
import { useApiQuery, type ApiQuery } from './useApiQuery'

export interface MenteeProgressData {
  summary: ProgressSummary
  months: MonthProgressRow[]
  tracks: TrackProgressRow[]
}

export function useMenteeProgress(): ApiQuery<MenteeProgressData> {
  return useApiQuery(
    async () => {
      const overview = await api.dashboard.mentee.overview()
      const rates = await api.mentees.attendanceRates(overview.points.mentee_id, overview.cohort_id)
      return {
        summary: progressSummary(overview.points),
        months: monthRows(rates.by_month, null),
        tracks: trackRows(rates.by_track),
      }
    },
    [],
    { fallbackError: "We couldn't load your progress. Try again." }
  )
}
