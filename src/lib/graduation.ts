// Graduation preview, record and sequence. Before graduation the preview comes from
// /cohorts/{id}/graduation/preview; once the Program Lead confirms, the frozen record from
// /cohorts/{id}/graduation.

import { api, fetchAllPages } from '@/lib/api'
import { formatDay, fullName } from '@/lib/format'
import { roleListLabel } from '@/lib/roles'
import { monthBoundaries } from '@/lib/sessions'
import type { CohortDetailResponse } from '@/types/cohort'
import type {
  GraduateRow,
  GraduationEntry,
  GraduationPreviewView,
  GraduationResultView,
  ProgramLeadHomeView,
  SequenceMentor,
  SequenceStep,
  SequenceView,
} from '@/types/graduation'

// The end date has passed once the whole end day is over
export function hasEnded(
  cohort: Pick<CohortDetailResponse, 'end_date'>,
  now: Date = new Date()
): boolean {
  const [year, month, day] = cohort.end_date.slice(0, 10).split('-').map(Number)
  return now >= new Date(year, month - 1, day + 1)
}

// Graduated, then possibly closed and archived
export function isGraduatedStatus(cohort: Pick<CohortDetailResponse, 'status'>): boolean {
  return cohort.status === 'completed' || cohort.status === 'archived'
}

function row(entry: GraduationEntry): GraduateRow {
  return {
    id: entry.mentee.id,
    name: fullName(entry.mentee) || entry.mentee.email,
    // The graduation routes don't send universities yet (gap 34)
    university: null,
    coreRate: entry.core_rate,
    totalPoints: entry.total_points,
  }
}

function highestFirst(entries: GraduationEntry[]): GraduateRow[] {
  return [...entries].sort((a, b) => b.core_rate - a.core_rate).map(row)
}

export function byName(a: GraduateRow, b: GraduateRow): number {
  return a.name.localeCompare(b.name)
}

// The confirmer is a user id; System Admins and the Program Lead can look the name up
async function confirmerName(userId: string | null): Promise<string | null> {
  if (!userId) return null
  const user = await api.admin.users.getById(userId).catch(() => null)
  return user ? fullName(user) || user.email : null
}

// With `forProgramLead`, the panel says whether Graduate cohort is available and why not
export async function loadGraduationPreview(
  cohortId: string,
  forProgramLead = false,
  now: Date = new Date()
): Promise<GraduationPreviewView> {
  const cohort = await api.cohorts.getById(cohortId)
  const base = {
    cohortId: cohort.id,
    cohortName: cohort.name,
    endDate: cohort.end_date,
    hasEnded: hasEnded(cohort, now),
    isClosed: cohort.closed_at !== null,
  }
  if (isGraduatedStatus(cohort)) {
    const record = await api.cohorts.graduation.record(cohortId)
    return {
      ...base,
      isGraduated: true,
      calculatedAt: record.confirmed_at,
      confirmedAt: record.confirmed_at,
      confirmedByName: await confirmerName(record.confirmed_by),
      threshold: record.threshold,
      graduates: highestFirst(record.graduates),
      nonGraduates: highestFirst(record.non_graduates),
      unavailableReasons: [],
    }
  }
  const [preview, panel] = await Promise.all([
    // A cohort that has never been calculated has no stored preview yet
    api.cohorts.graduation
      .preview(cohortId)
      .catch(() => api.cohorts.graduation.refreshPreview(cohortId)),
    forProgramLead ? api.cohorts.graduation.panel(cohortId).catch(() => null) : null,
  ])
  return {
    ...base,
    isGraduated: false,
    calculatedAt: preview.computed_at,
    confirmedAt: null,
    confirmedByName: null,
    threshold: preview.threshold,
    graduates: highestFirst(preview.graduates),
    nonGraduates: highestFirst(preview.non_graduates),
    unavailableReasons: panel
      ? panel.availability.available
        ? []
        : panel.availability.reasons
      : null,
  }
}

export async function loadProgramLeadHome(
  cohortId: string,
  nameFor: (userId: string) => string
): Promise<ProgramLeadHomeView> {
  const now = new Date()
  const [cohort, panel, requests, upcoming] = await Promise.all([
    api.cohorts.getById(cohortId),
    api.cohorts.graduation.panel(cohortId).catch(() => null),
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
      isGraduated: isGraduatedStatus(cohort),
      isAvailable: panel?.availability.available ?? hasEnded(cohort, now),
      reasons: panel?.availability.reasons ?? [],
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

// Alphabetical unless an order was set
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
  const [peer, ict, professional] = await Promise.all([
    fetchAllPages((page, page_size) =>
      api.cohorts.enrollments.list(cohortId, { page, page_size, role: 'peer_mentor_1_1' })
    ).catch(() => []),
    fetchAllPages((page, page_size) =>
      api.cohorts.enrollments.list(cohortId, { page, page_size, role: 'peer_mentor_ict' })
    ).catch(() => []),
    fetchAllPages((page, page_size) =>
      api.cohorts.enrollments.list(cohortId, { page, page_size, role: 'professional_mentor' })
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
  for (const enrollment of professional) {
    const name = fullName(enrollment.user)
    if (seen.has(name)) continue
    seen.add(name)
    mentors.push({ name, role: 'Professional Mentor' })
  }
  return mentors
}

// The sequence route gives graduates in the saved reveal order and the mentors who served.
// Only the Program Lead may read it; anyone else, or a refusal, gets a rehearsal built from
// the preview, alphabetically.
export async function loadSequence(cohortId: string): Promise<SequenceView> {
  const [cohort, sequence, activities] = await Promise.all([
    api.cohorts.getById(cohortId),
    api.cohorts.graduation.sequence(cohortId).catch(() => null),
    api.analytics.activities(cohortId).catch(() => null),
  ])
  const logged = sum((activities?.types ?? []).map((type) => sum(Object.values(type.counts))))
  const consultations = sum(
    (activities?.types ?? [])
      .filter((type) => type.type === 'consultation')
      .map((type) => sum(Object.values(type.counts)))
  )
  const months = monthBoundaries(cohort).length
  const base = {
    cohortName: cohort.name,
    startDate: cohort.start_date,
    endDate: cohort.end_date,
    months,
    isRehearsal: !isGraduatedStatus(cohort),
  }
  if (sequence) {
    return {
      ...base,
      numbers: [
        { label: 'months', value: months },
        { label: 'sessions held', value: sequence.stats.sessions_held },
        { label: 'points earned', value: sequence.stats.points_distributed },
        { label: 'extra activities', value: logged },
        { label: 'consultations', value: consultations },
      ],
      graduates: sequence.graduates.map(row),
      mentors: sequence.mentors.map((mentor) => ({
        name: fullName(mentor.user),
        role: roleListLabel(mentor.roles),
      })),
    }
  }
  const [preview, sessions, mentors] = await Promise.all([
    loadGraduationPreview(cohortId),
    fetchAllPages((page, page_size) =>
      api.sessions.list({ page, page_size, cohort_id: cohortId })
    ).catch(() => []),
    loadMentors(cohortId),
  ])
  const now = new Date()
  const held = sessions.filter(
    (s) => (s.status === 'published' || s.status === 'completed') && new Date(s.ends_at) <= now
  ).length
  return {
    ...base,
    numbers: [
      { label: 'months', value: months },
      { label: 'sessions held', value: held },
      {
        label: 'points earned',
        value: sum([...preview.graduates, ...preview.nonGraduates].map((e) => e.totalPoints)),
      },
      { label: 'extra activities', value: logged },
      { label: 'consultations', value: consultations },
    ],
    graduates: revealOrder(preview.graduates, null),
    mentors,
  }
}

// null until the cohort's result is final. Each part loads on its own, so a refused one
// only blanks its own number.
export async function loadGraduationResult(
  userId: string,
  firstName: string,
  cohortId: string
): Promise<GraduationResultView | null> {
  const status = await api.mentees.finalStatus(userId, cohortId)
  if (!status.is_final) return null
  const [cohort, overview, rates, card] = await Promise.all([
    api.cohorts.getById(cohortId),
    api.dashboard.mentee.overview(cohortId).catch(() => null),
    api.mentees.attendanceRates(userId, cohortId).catch(() => null),
    // Graduates only
    api.users.graduationCard().catch(() => null),
  ])
  return {
    firstName,
    cohortName: cohort.name,
    graduated: status.status === 'graduated',
    graduatedOn: card?.cohort.id === cohortId ? card.graduated_on : cohort.end_date,
    coreRate: rates?.core_rate ?? null,
    overallRate: rates?.overall_rate ?? null,
    totalPoints: overview?.points.total_points ?? null,
    sessionsAttended: overview?.points.sessions_attended ?? null,
    threshold: cohort.graduation_threshold,
  }
}
