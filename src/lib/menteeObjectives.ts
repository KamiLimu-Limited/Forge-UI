// =============================================================================
// Shows the API's fixed skills as objectives until it stores each mentee's own.
// See docs/api-gaps.md.
// =============================================================================

import { formatDay, formatDayMonth } from '@/lib/format'
import type {
  MenteeObjectivesData,
  ObjectiveGroup,
  ObjectiveRow,
  RatingWindowView,
} from '@/types/menteeObjectives'
import type { RatingPoint, SkillProgressResponse, SkillRatingWindowStatus } from '@/types/skills'

export const RATING_POINTS: RatingPoint[] = ['early', 'mid', 'late']

const POINT_LABELS: Record<RatingPoint, string> = { early: 'Start', mid: 'Mid', late: 'End' }

export const OBJECTIVE_GROUPS: ObjectiveGroup[] = ['Human', 'Technical']

// "problem_solving" to "Problem solving"
export function skillLabel(skill: string): string {
  const words = skill.replace(/_/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function skillGroup(skill: string): ObjectiveGroup {
  return skill.toLowerCase().includes('technical') ? 'Technical' : 'Human'
}

function windowView(point: RatingPoint, status?: SkillRatingWindowStatus): RatingWindowView {
  return {
    point,
    label: POINT_LABELS[point],
    isOpen: status?.is_open ?? false,
    opensLabel: status?.opens_at ? formatDayMonth(status.opens_at) : null,
    closesLabel: status?.closes_at ? formatDay(status.closes_at) : null,
  }
}

export function objectivesData(
  cohortId: string,
  progress: SkillProgressResponse,
  statuses: SkillRatingWindowStatus[]
): MenteeObjectivesData {
  const scoreFor = (skill: string, point: RatingPoint) =>
    progress.ratings.find((rating) => rating.rating_point === point)?.ratings[skill] ?? null

  const objectives: ObjectiveRow[] = progress.skill_names.map((skill) => ({
    skill,
    label: skillLabel(skill),
    group: skillGroup(skill),
    scores: {
      early: scoreFor(skill, 'early'),
      mid: scoreFor(skill, 'mid'),
      late: scoreFor(skill, 'late'),
    },
  }))
  const windows = RATING_POINTS.map((point) =>
    windowView(
      point,
      statuses.find((status) => status.rating_point === point)
    )
  )
  return {
    cohortId,
    objectives,
    windows,
    openWindow: windows.find((window) => window.isOpen) ?? null,
  }
}
