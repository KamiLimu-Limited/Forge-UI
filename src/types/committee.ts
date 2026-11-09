// =============================================================================
// What the committee (and the Program Lead's oversight screens) draw. Numbers only: no
// status labels such as on track, warning or at risk, even where the API sends them.
// =============================================================================

import type { BarListItem } from '@/components/ui/BarList'
import type { ColumnChartItem } from '@/components/ui/ColumnChart'

export interface CohortNumbers {
  menteesEnrolled: number
  // 0 to 100
  coreRate: number | null
  overallRate: number | null
  // null when the leaderboard couldn't be read
  pointsDistributed: number | null
  sessionsCompleted: number
  sessionsTotal: number
  // The graduation threshold, 0 to 100
  threshold: number
}

export interface CommitteeOverviewView {
  cohortName: string
  // "Cohort 11, Month 5 of 8"
  subtitle: string
  numbers: CohortNumbers
  // One column per KamiLimu month; months still to come have no value
  monthRates: ColumnChartItem[]
  trackRates: BarListItem[]
  activities: BarListItem[]
  activitiesMax: number
}

export interface CommitteeTrendsView {
  cohortName: string
  monthRates: ColumnChartItem[]
  trackRates: ColumnChartItem[]
  // Average session rating per month, out of 5
  ratingByMonth: ColumnChartItem[]
  activities: ColumnChartItem[]
  activitiesMax: number
}

export interface CohortOption {
  id: string
  name: string
}

export interface ComparisonMeasure {
  label: string
  current: number | null
  other: number | null
  // 100 for rates, 5 for ratings
  max: number
  // "84%" or "4.4"
  format: 'percent' | 'rating'
}

export interface ComparisonCount {
  label: string
  current: number | null
  other: number | null
}

export interface CrossCohortView {
  current: CohortOption
  // null when there is no other cohort to compare with
  other: CohortOption | null
  // Every other cohort the viewer can compare with
  options: CohortOption[]
  measures: ComparisonMeasure[]
  counts: ComparisonCount[]
}
