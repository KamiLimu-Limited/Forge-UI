// Committee numbers from /dashboard/committee/cohort-health, /analytics/* and the
// leaderboard. The backend computes every rate; these only reshape them for the charts.

import { api, fetchAllPages } from '@/lib/api'
import { formatPercentage } from '@/lib/format'
import { ACTIVITY_TYPE_LABELS } from '@/lib/labels'
import { monthBoundaries, monthForDate } from '@/lib/sessions'
import type { BarListItem } from '@/components/ui/BarList'
import type { ColumnChartItem } from '@/components/ui/ColumnChart'
import type {
  ActivityEngagementResponse,
  AttendanceTrendResponse,
  SessionQualityResponse,
  TrackPerformanceResponse,
} from '@/types/analytics'
import type { CohortDetailResponse } from '@/types/cohort'
import type {
  CohortNumbers,
  CommitteeOverviewView,
  CommitteeTrendsView,
  ComparisonCount,
  ComparisonMeasure,
  CrossCohortView,
} from '@/types/committee'
import type { SessionResponse } from '@/types/session'

function settled<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === 'fulfilled' ? result.value : null
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0)
}

// "Month 5 of 8", or '' outside the programme months
export function cohortSubtitle(cohort: CohortDetailResponse, now: Date = new Date()): string {
  const month = monthForDate(cohort, now)
  const total = monthBoundaries(cohort).length
  if (!month) return ''
  return `Month ${month}${total ? ` of ${total}` : ''}`
}

// One column per KamiLimu month in the cohort, with the months still to come left empty
export function monthColumns(
  cohort: CohortDetailResponse,
  trends: AttendanceTrendResponse | null,
  short: boolean
): ColumnChartItem[] {
  const months = monthBoundaries(cohort).map((boundary) => boundary.month)
  const numbers = months.length > 0 ? months : (trends?.months ?? []).map((point) => point.month)
  return numbers.map((month) => {
    const point = trends?.months.find((item) => item.month === month)
    return {
      label: short ? `M${month}` : `Month ${month}`,
      value: point && point.sessions > 0 ? point.rate : null,
      display: point ? (formatPercentage(point.rate) ?? '') : '',
    }
  })
}

function trackLabel(track: string): string {
  return track.toLowerCase() === 'core' ? 'Core sessions' : track
}

export function trackBars(performance: TrackPerformanceResponse | null): BarListItem[] {
  return (performance?.tracks ?? []).map((track) => ({
    label: trackLabel(track.track),
    value: track.bucket.rate,
    display: formatPercentage(track.bucket.rate) ?? '',
  }))
}

export function activityBars(engagement: ActivityEngagementResponse | null): BarListItem[] {
  return (engagement?.types ?? [])
    .map((type) => {
      const logged = sum(Object.values(type.counts))
      return { label: ACTIVITY_TYPE_LABELS[type.type], value: logged, display: String(logged) }
    })
    .sort((a, b) => b.value - a.value)
}

// The average of each session's quality rating, per KamiLimu month
export function ratingColumns(quality: SessionQualityResponse | null): ColumnChartItem[] {
  const byMonth = new Map<number, number[]>()
  for (const session of quality?.sessions ?? []) {
    if (session.quality === null || session.responses === 0) continue
    byMonth.set(session.kami_limu_month, [
      ...(byMonth.get(session.kami_limu_month) ?? []),
      session.quality,
    ])
  }
  return [...byMonth.entries()]
    .sort(([a], [b]) => a - b)
    .map(([month, ratings]) => {
      const average = sum(ratings) / ratings.length
      return { label: `Month ${month}`, value: average, display: average.toFixed(1) }
    })
}

function isScheduled(session: SessionResponse): boolean {
  return session.status === 'published' || session.status === 'completed'
}

async function loadSessions(cohortId: string): Promise<SessionResponse[]> {
  return fetchAllPages((page, page_size) =>
    api.sessions.list({ page, page_size, cohort_id: cohortId })
  )
}

export async function loadCohortNumbers(
  cohort: CohortDetailResponse,
  now: Date = new Date()
): Promise<CohortNumbers> {
  const [health, leaderboard, sessions] = await Promise.allSettled([
    api.dashboard.cohortHealth(cohort.id),
    api.leaderboard.full(cohort.id),
    loadSessions(cohort.id),
  ])
  if (health.status === 'rejected') throw health.reason
  const scheduled = (settled(sessions) ?? []).filter(isScheduled)
  const board = settled(leaderboard)
  return {
    menteesEnrolled: health.value.total_mentees,
    coreRate: health.value.total_mentees > 0 ? health.value.average_core_rate : null,
    overallRate: health.value.total_mentees > 0 ? health.value.average_combined_rate : null,
    pointsDistributed: board ? sum(board.entries.map((entry) => entry.total_points)) : null,
    sessionsCompleted: scheduled.filter((session) => new Date(session.ends_at) <= now).length,
    sessionsTotal: scheduled.length,
    threshold: cohort.graduation_threshold,
  }
}

export async function loadCommitteeOverview(cohortId: string): Promise<CommitteeOverviewView> {
  const cohort = await api.cohorts.getById(cohortId)
  const [numbers, trends, tracks, activities] = await Promise.allSettled([
    loadCohortNumbers(cohort),
    api.analytics.attendanceTrends(cohortId),
    api.analytics.trackPerformance(cohortId),
    api.analytics.activities(cohortId),
  ])
  if (numbers.status === 'rejected') throw numbers.reason
  const activityRows = activityBars(settled(activities))
  return {
    cohortName: cohort.name,
    subtitle: cohortSubtitle(cohort),
    numbers: numbers.value,
    monthRates: monthColumns(cohort, settled(trends), true),
    trackRates: trackBars(settled(tracks)),
    activities: activityRows,
    activitiesMax: Math.max(0, ...activityRows.map((row) => row.value)),
  }
}

export async function loadCommitteeTrends(cohortId: string): Promise<CommitteeTrendsView> {
  const cohort = await api.cohorts.getById(cohortId)
  const [trends, tracks, quality, activities] = await Promise.all([
    api.analytics.attendanceTrends(cohortId),
    api.analytics.trackPerformance(cohortId),
    api.analytics.sessionQuality(cohortId),
    api.analytics.activities(cohortId),
  ])
  const activityRows = activityBars(activities)
  return {
    cohortName: cohort.name,
    monthRates: monthColumns(cohort, trends, false).filter((column) => column.value !== null),
    trackRates: trackBars(tracks).map((row) => ({
      label: row.label,
      value: row.value,
      display: row.display,
    })),
    ratingByMonth: ratingColumns(quality),
    activities: activityRows,
    activitiesMax: Math.max(0, ...activityRows.map((row) => row.value)),
  }
}

function consultations(engagement: ActivityEngagementResponse | null): number | null {
  if (!engagement) return null
  const type = engagement.types.find((item) => item.type === 'consultation')
  return type ? sum(Object.values(type.counts)) : 0
}

// The viewer's cohort against one other. With no other cohort chosen, the newest earlier
// one is used. Comparing at the same point in the programme isn't possible yet (gap).
export async function loadCrossCohort(
  cohortId: string,
  otherId: string | null
): Promise<CrossCohortView> {
  const all = await fetchAllPages((page, page_size) => api.cohorts.list({ page, page_size }))
  const current = all.find((cohort) => cohort.id === cohortId)
  if (!current) throw new Error("We couldn't find this cohort.")
  const others = all
    .filter((cohort) => cohort.id !== cohortId)
    .sort((a, b) => b.start_date.localeCompare(a.start_date))
  const other =
    others.find((cohort) => cohort.id === otherId) ??
    others.find((cohort) => cohort.start_date < current.start_date) ??
    others[0] ??
    null
  const options = others.map((cohort) => ({ id: cohort.id, name: cohort.name }))
  const ids = other ? [current.id, other.id] : [current.id]

  const [comparison, qualities, engagements, sessionLists] = await Promise.all([
    api.analytics.crossCohort(ids),
    Promise.allSettled(ids.map((id) => api.analytics.sessionQuality(id))),
    Promise.allSettled(ids.map((id) => api.analytics.activities(id))),
    Promise.allSettled(ids.map((id) => loadSessions(id))),
  ])
  const row = (id: string) => comparison.cohorts.find((item) => item.cohort_id === id) ?? null
  const now = new Date()
  const at = (index: number) => {
    const found = row(ids[index])
    const sessions = settled(sessionLists[index])
    const engagement = settled(engagements[index])
    return {
      core: found && found.health.total_mentees > 0 ? found.health.average_core_rate : null,
      overall: found && found.health.total_mentees > 0 ? found.health.average_combined_rate : null,
      rating: settled(qualities[index])?.overall_quality ?? null,
      mentees: found?.health.total_mentees ?? null,
      sessions: sessions
        ? sessions.filter((s) => isScheduled(s) && new Date(s.ends_at) <= now).length
        : null,
      activities: found
        ? Math.round(found.activities_per_mentee * found.health.total_mentees)
        : null,
      consultations: consultations(engagement),
    }
  }
  const mine = at(0)
  const theirs = other ? at(1) : null

  const measures: ComparisonMeasure[] = [
    {
      label: 'Core attendance rate',
      current: mine.core,
      other: theirs?.core ?? null,
      max: 100,
      format: 'percent',
    },
    {
      label: 'Overall attendance rate',
      current: mine.overall,
      other: theirs?.overall ?? null,
      max: 100,
      format: 'percent',
    },
    {
      label: 'Average session rating',
      current: mine.rating,
      other: theirs?.rating ?? null,
      max: 5,
      format: 'rating',
    },
  ]
  const counts: ComparisonCount[] = [
    { label: 'Mentees enrolled', current: mine.mentees, other: theirs?.mentees ?? null },
    { label: 'Sessions completed', current: mine.sessions, other: theirs?.sessions ?? null },
    {
      label: 'Extra activities logged',
      current: mine.activities,
      other: theirs?.activities ?? null,
    },
    { label: 'Consultations', current: mine.consultations, other: theirs?.consultations ?? null },
  ]
  return {
    current: { id: current.id, name: current.name },
    other: other ? { id: other.id, name: other.name } : null,
    options,
    measures,
    counts,
  }
}
