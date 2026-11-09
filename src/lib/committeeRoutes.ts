// Committee and Program Delivery Lead paths, like lib/menteeRoutes.ts
export const COMMITTEE_ROUTES = {
  home: '/dashboard',
  trends: '/dashboard/committee/trends',
  crossCohort: '/dashboard/committee/cross-cohort',
  leaderboards: '/dashboard/committee/leaderboards',
}

export const DELIVERY_LEAD_ROUTES = {
  tasks: '/dashboard/tasks',
  newTask: '/dashboard/tasks/new',
  groupMeetings: '/dashboard/group-meetings',
}

export function editTaskRoute(sessionId: string): string {
  return `${DELIVERY_LEAD_ROUTES.tasks}/${sessionId}`
}
