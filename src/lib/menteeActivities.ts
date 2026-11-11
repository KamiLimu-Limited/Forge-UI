// Turns the mentee's activity logs into the rows the activities screens draw

import { EVENT_ROLE_LABELS } from '@/lib/labels'
import type {
  ExtraActivityResponse,
  OpportunityApplicationResponse,
  ScholarshipApplicationResponse,
} from '@/types/activity'
import type {
  ActivityKind,
  ActivityLogRow,
  ActivityTile,
  ApplicationView,
  MenteeActivitiesData,
} from '@/types/menteeActivities'

const RECENT_COUNT = 10

const TILE_LABELS: Record<ActivityKind, string> = {
  consultation: 'Consultations',
  event: 'External events',
  job: 'Job applications',
  scholarship: 'Scholarship applications',
  academic: 'KamiLimu to Academia',
}

const TYPE_LABELS: Record<ActivityKind, string> = {
  consultation: 'Consultation',
  event: 'External event',
  job: 'Job application',
  scholarship: 'Scholarship application',
  academic: 'KamiLimu to Academia',
}

const TILE_ORDER: ActivityKind[] = ['consultation', 'event', 'job', 'scholarship', 'academic']

type ApplicationResponse = OpportunityApplicationResponse | ScholarshipApplicationResponse

export function isApplication(activity: ExtraActivityResponse): activity is ApplicationResponse {
  return activity.type === 'opportunity' || activity.type === 'scholarship'
}

function activityKind(activity: ExtraActivityResponse): ActivityKind {
  return activity.type === 'opportunity' ? 'job' : activity.type
}

function detailLine(activity: ExtraActivityResponse): string {
  switch (activity.type) {
    case 'event':
      return `${activity.title}, as ${EVENT_ROLE_LABELS[activity.details.event_role]}`
    case 'opportunity':
      return `${activity.details.organisation}, ${activity.title}`
    default:
      return activity.title
  }
}

function logRow(activity: ExtraActivityResponse): ActivityLogRow {
  const kind = activityKind(activity)
  return {
    id: activity.id,
    kind,
    typeLabel: TYPE_LABELS[kind],
    details: detailLine(activity),
    date: activity.date,
    points: activity.points_awarded,
    status: activity.status,
    canUpdate: isApplication(activity) && activity.status === 'active',
  }
}

export function activitiesData(activities: ExtraActivityResponse[]): MenteeActivitiesData {
  const rows = activities.map(logRow)
  const tiles: ActivityTile[] = TILE_ORDER.map((kind) => {
    const ofKind = rows.filter((row) => row.kind === kind)
    return {
      kind,
      label: TILE_LABELS[kind],
      count: ofKind.length,
      points: ofKind.reduce((sum, row) => sum + row.points, 0),
    }
  })
  return {
    totalPoints: rows.reduce((sum, row) => sum + row.points, 0),
    loggedCount: rows.length,
    tiles,
    recent: [...rows].sort((a, b) => b.date.localeCompare(a.date)).slice(0, RECENT_COUNT),
  }
}

export function applicationView(activity: ApplicationResponse): ApplicationView {
  return {
    id: activity.id,
    kind: activity.type === 'scholarship' ? 'scholarship' : 'job',
    title: activity.title,
    organization: activity.details.organisation,
    stage: activity.details.stage ?? 'applied',
    finalOutcome: activity.details.final_outcome ?? 'waiting_for_response',
    points: activity.points_awarded,
    canUpdate: activity.status === 'active',
  }
}
