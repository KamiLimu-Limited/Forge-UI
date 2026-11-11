// Turns a person's objectives and the rating windows into what the objectives screens draw

import { formatDay, formatDayMonth } from '@/lib/format'
import type {
  MenteeObjectivesData,
  ObjectiveGroup,
  ObjectiveRow,
  RatingWindowView,
} from '@/types/menteeObjectives'
import type {
  ObjectiveResponse,
  ObjectiveType,
  ObjectiveWindow,
  RatingPoint,
} from '@/types/objective'

export const RATING_POINTS: RatingPoint[] = ['start', 'mid', 'end']

export const POINT_LABELS: Record<RatingPoint, string> = { start: 'Start', mid: 'Mid', end: 'End' }

export const OBJECTIVE_GROUPS: ObjectiveGroup[] = ['Human', 'Technical']

const GROUP_FOR: Record<ObjectiveType, ObjectiveGroup> = { human: 'Human', technical: 'Technical' }

function windowView(point: RatingPoint, window?: ObjectiveWindow): RatingWindowView {
  return {
    point,
    label: POINT_LABELS[point],
    isOpen: window?.is_open ?? false,
    opensLabel: window?.opens_at ? formatDayMonth(window.opens_at) : null,
    closesLabel: window?.closes_at ? formatDay(window.closes_at) : null,
  }
}

export function scoreAt(objective: ObjectiveResponse, point: RatingPoint): number | null {
  return objective.ratings.find((rating) => rating.rating_point === point)?.score ?? null
}

export function objectiveRow(objective: ObjectiveResponse): ObjectiveRow {
  return {
    id: objective.id,
    label: objective.text,
    group: GROUP_FOR[objective.type],
    scores: {
      start: scoreAt(objective, 'start'),
      mid: scoreAt(objective, 'mid'),
      end: scoreAt(objective, 'end'),
    },
  }
}

export function objectivesData(
  cohortId: string,
  objectives: ObjectiveResponse[],
  windows: ObjectiveWindow[]
): MenteeObjectivesData {
  const views = RATING_POINTS.map((point) =>
    windowView(
      point,
      windows.find((window) => window.rating_point === point)
    )
  )
  return {
    cohortId,
    objectives: objectives.map(objectiveRow),
    windows: views,
    openWindow: views.find((window) => window.isOpen) ?? null,
  }
}
