// =============================================================================
// Graduation preview, record and sequence, all from GET /cohorts/{id}/graduation-report
// for now. Graduates are the mentees whose core rate meets the threshold, or, once the
// cohort is final, those the report marks graduated.
// =============================================================================

import { api, fetchAllPages } from '@/lib/api'
import { formatDay, fullName } from '@/lib/format'
import { monthBoundaries } from '@/lib/sessions'
import type { CohortDetailResponse } from '@/types/cohort'
import type {
  GraduateRow,
  GraduationPreviewView,
  GraduationReportEntry,
  GraduationReportResponse,
  ProgramLeadHomeView,
  SequenceMentor,
  SequenceStep,
  SequenceView,
} from '@/types/graduation'

export const REVEAL_ORDER_KEY = 'kamilimu_reveal_order'

// The end date has passed once the whole end day is over
export function hasEnded(
  cohort: Pick<CohortDetailResponse, 'end_date'>,
  now: Date = new Date()
): boolean {
  const [year, month, day] = cohort.end_date.slice(0, 10).split('-').map(Number)
  return now >= new Date(year, month - 1, day + 1)
}

export function isGraduate(
  entry: GraduationReportEntry,
  threshold: number,
  isFinal: boolean
): boolean {
  if (isFinal) return entry.status === 'graduated'
  return entry.core_rate >= threshold
}

function row(entry: GraduationReportEntry): GraduateRow {
  return {
    id: entry.mentee.id,
    name: fullName(entry.mentee) || entry.mentee.email,
    university: null,
    coreRate: entry.core_rate,
    totalPoints: entry.total_points,
  }
}

export function byName(a: GraduateRow, b: GraduateRow): number {
  return a.name.localeCompare(b.name)
}

export function previewView(
  cohort: CohortDetailResponse,
  report: GraduationReportResponse,
  now: Date = new Date()
): GraduationPreviewView {
  const isGraduated = cohort.status === 'completed'
  const highestFirst = [...report.mentees].sort((a, b) => b.core_rate - a.core_rate)
  return {
    cohortId: cohort.id,
    cohortName: cohort.name,
    endDate: cohort.end_date,
    hasEnded: hasEnded(cohort, now),
    isGraduated,
    calculatedAt: report.generated_at,
    threshold: report.threshold,
    graduates: highestFirst.filter((e) => isGraduate(e, report.threshold, isGraduated)).map(row),
    nonGraduates: highestFirst
      .filter((e) => !isGraduate(e, report.threshold, isGraduated))
      .map(row),
  }
}

export async function loadGraduationPreview(cohortId: string): Promise<GraduationPreviewView> {
  const [cohort, report] = await Promise.all([
    api.cohorts.getById(cohortId),
    api.cohorts.graduationReport(cohortId),
  ])
  return previewView(cohort, report)
}

export async function loadProgramLeadHome(
  cohortId: string,
  nameFor: (userId: string) => string
): Promise<ProgramLeadHomeView> {
  const now = new Date()
  const [cohort, requests, upcoming] = await Promise.all([
    api.cohorts.getById(cohortId),
    api.attendance.overrideRequests
      .list({ status: 'pending', cohort_id: cohortId, page_size: 3 })
      .catch(() => null),
    api.sessions
      .list({
        cohort_id: cohortId,
        status: 'published',
        starts_after: now.toISOString(),
        page_size: 3,
      })
      .catch(() => null),
  ])
  return {
    graduation: {
      endDate: cohort.end_date,
      hasEnded: hasEnded(cohort, now),
      isGraduated: cohort.status === 'completed',
    },
    pendingTotal: requests?.total ?? 0,
    pendingRequests: (requests?.items ?? []).map((request) => ({
      id: request.id,
      menteeName: nameFor(request.mentee_id),
      sessionLine: request.session
        ? `${request.session.title}, ${formatDay(request.session.starts_at)}`
        : 'Session',
    })),
    upcoming: (upcoming?.items ?? []).map((session) => ({
      id: session.id,
      title: session.title,
      startsAt: session.starts_at,
      isVirtual: session.mode !== 'physical',
    })),
  }
}

// Alphabetical unless the Program Lead set an order to rehearse (kept in this browser
// only, since the API can't store it yet)
export function revealOrder(graduates: GraduateRow[], savedIds: string[] | null): GraduateRow[] {
  const alphabetical = [...graduates].sort(byName)
  if (!savedIds) return alphabetical
  const position = new Map(savedIds.map((id, index) => [id, index]))
  return [...alphabetical].sort(
    (a, b) =>
      (position.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
      (position.get(b.id) ?? Number.MAX_SAFE_INTEGER)
  )
}

export function readSavedOrder(cohortId: string): string[] | null {
  try {
    const raw = window.sessionStorage.getItem(`${REVEAL_ORDER_KEY}:${cohortId}`)
    const parsed: unknown = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) && parsed.every((id) => typeof id === 'string') ? parsed : null
  } catch {
    return null
  }
}

export function saveOrderForRehearsal(cohortId: string, ids: string[]): void {
  try {
    window.sessionStorage.setItem(`${REVEAL_ORDER_KEY}:${cohortId}`, JSON.stringify(ids))
  } catch {
    // Storage can be blocked; the rehearsal then plays alphabetically
  }
}

export function sequenceSteps(view: Pick<SequenceView, 'graduates'>): SequenceStep[] {
  return [
    { kind: 'opening' },
    { kind: 'numbers' },
    ...view.graduates.map((_, index) => ({ kind: 'reveal' as const, index })),
    { kind: 'mentors' },
    { kind: 'closing' },
  ]
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0)
}

async function loadMentors(cohortId: string): Promise<SequenceMentor[]> {
  const [peer, ict, sessions] = await Promise.all([
    fetchAllPages((page, page_size) =>
      api.cohorts.enrollments.list(cohortId, { page, page_size, role: 'peer_mentor_1:1' })
    ).catch(() => []),
    fetchAllPages((page, page_size) =>
      api.cohorts.enrollments.list(cohortId, { page, page_size, role: 'peer_mentor_ict' })
    ).catch(() => []),
    fetchAllPages((page, page_size) =>
      api.sessions.list({ page, page_size, cohort_id: cohortId, session_type: 'professional' })
    ).catch(() => []),
  ])
  const mentors: SequenceMentor[] = [
    ...peer.map((e) => ({ name: fullName(e.user), role: '1:1 Peer Mentor' })),
    ...ict.map((e) => ({
      name: fullName(e.user),
      role: e.ict_track ? `ICT Peer Mentor, ${e.ict_track}` : 'ICT Peer Mentor',
    })),
  ]
  const seen = new Set(mentors.map((m) => m.name))
  for (const session of sessions) {
    for (const mentor of session.mentors) {
      const name = fullName(mentor.user)
      if (seen.has(name)) continue
      seen.add(name)
      mentors.push({ name, role: session.title })
    }
  }
  return mentors
}

export async function loadSequence(cohortId: string): Promise<SequenceView> {
  const [cohort, report] = await Promise.all([
    api.cohorts.getById(cohortId),
    api.cohorts.graduationReport(cohortId),
  ])
  const [sessions, activities, mentors] = await Promise.all([
    fetchAllPages((page, page_size) =>
      api.sessions.list({ page, page_size, cohort_id: cohortId })
    ).catch(() => []),
    api.analytics.activities(cohortId).catch(() => null),
    loadMentors(cohortId),
  ])
  const preview = previewView(cohort, report)
  const now = new Date()
  const held = sessions.filter(
    (s) => (s.status === 'published' || s.status === 'completed') && new Date(s.ends_at) <= now
  ).length
  const logged = sum((activities?.types ?? []).map((type) => sum(Object.values(type.counts))))
  const consultations = sum(
    (activities?.types ?? [])
      .filter((type) => type.type === 'consultation')
      .map((type) => sum(Object.values(type.counts)))
  )
  const months = monthBoundaries(cohort).length
  return {
    cohortName: cohort.name,
    startDate: cohort.start_date,
    endDate: cohort.end_date,
    months,
    numbers: [
      { label: 'months', value: months },
      { label: 'sessions held', value: held },
      { label: 'points earned', value: sum(report.mentees.map((e) => e.total_points)) },
      { label: 'extra activities', value: logged },
      { label: 'consultations', value: consultations },
    ],
    graduates: revealOrder(preview.graduates, readSavedOrder(cohortId)),
    mentors,
    // No confirmed graduation record exists in the API yet, so every play is a rehearsal
    isRehearsal: true,
  }
}
