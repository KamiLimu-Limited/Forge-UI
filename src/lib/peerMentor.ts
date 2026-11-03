// =============================================================================
// Turns the peer mentor API responses into read-only views of a mentee
// =============================================================================

import { ratingsOf } from '@/lib/menteeSessions'
import { RATING_POINTS, skillLabel } from '@/lib/menteeObjectives'
import type { ActivityType } from '@/types/activity'
import type { AttendanceResponse, AttendanceStatus } from '@/types/attendance'
import type { MenteeDrilldown, MenteeSummary, SessionPointsEntry } from '@/types/dashboard'
import type {
  MenteeAttendanceRow,
  MenteeCardView,
  MenteeDetailView,
  MenteeFeedbackRow,
  MenteeObjectiveRow,
} from '@/types/peerMentor'
import type { RatingPoint, SkillProgressResponse } from '@/types/skills'

const POINT_LABELS: Record<RatingPoint, string> = { early: 'Start', mid: 'Mid', late: 'End' }

const ACTIVITY_ROWS: { type: ActivityType; label: string }[] = [
  { type: 'consultation', label: 'Consultations' },
  { type: 'event', label: 'External events' },
  // The API has one type for job and scholarship applications. See docs/api-gaps.md.
  { type: 'opportunity', label: 'Applications' },
  { type: 'academic', label: 'KamiLimu to Academia' },
]

export function menteeCard(summary: MenteeSummary): MenteeCardView {
  const { first_name, last_name, id } = summary.mentee
  return {
    id,
    name: `${first_name} ${last_name}`.trim(),
    coreRate: summary.core_rate,
    overallRate: summary.combined_rate,
    points: summary.total_points,
  }
}

function attendanceState(
  entry: SessionPointsEntry,
  record: AttendanceResponse | undefined
): AttendanceStatus {
  if (record && record.status !== 'pending') return record.status
  if (entry.outcome === 'attended') return 'attended'
  if (entry.outcome === 'excused') return 'excused'
  return 'missed'
}

function attendanceRows(
  entries: SessionPointsEntry[],
  records: AttendanceResponse[]
): MenteeAttendanceRow[] {
  return entries
    .filter((entry) => entry.outcome !== 'upcoming')
    .map((entry) => ({
      sessionId: entry.session_id,
      title: entry.title,
      startsAt: entry.starts_at,
      state: attendanceState(
        entry,
        records.find((record) => record.session_id === entry.session_id)
      ),
    }))
}

function objectiveRows(progress: SkillProgressResponse): MenteeObjectiveRow[] {
  return progress.skill_names.map((skill) => {
    const scores = RATING_POINTS.flatMap((point) => {
      const score = progress.ratings.find((rating) => rating.rating_point === point)?.ratings[skill]
      return score === undefined ? [] : [`${POINT_LABELS[point]} ${score}`]
    })
    return {
      skill,
      label: skillLabel(skill),
      summary: scores.length > 0 ? scores.join(', ') : 'Not yet rated',
    }
  })
}

function feedbackRows(records: AttendanceResponse[]): MenteeFeedbackRow[] {
  return records.flatMap((record) => {
    const ratings = ratingsOf(record)
    if (ratings.length === 0 && !record.feedback) return []
    return [
      {
        sessionId: record.session_id,
        title: record.session.title,
        ratings,
        feedback: record.feedback,
      },
    ]
  })
}

export function menteeDetail(
  drilldown: MenteeDrilldown,
  progress: SkillProgressResponse | null,
  records: AttendanceResponse[] | null
): MenteeDetailView {
  return {
    card: menteeCard(drilldown.summary),
    attendance: attendanceRows(drilldown.points.sessions, records ?? []),
    objectives: progress ? objectiveRows(progress) : null,
    activities: ACTIVITY_ROWS.map(({ type, label }) => ({
      label,
      count: drilldown.points.extra_activities.filter((activity) => activity.type === type).length,
    })),
    feedback: records ? feedbackRows(records) : null,
  }
}
