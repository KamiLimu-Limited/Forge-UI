// Mentee paths in one place. The /dashboard layout for mentees still has to be agreed,
// so only this file should change when it is.
export const MENTEE_ROUTES = {
  home: '/dashboard',
  progress: '/dashboard/progress',
  sessions: '/dashboard/sessions',
  sessionHistory: '/dashboard/sessions/history',
  activities: '/dashboard/activities',
  objectives: '/dashboard/objectives',
  leaderboard: '/dashboard/leaderboard',
  chooseTrack: '/dashboard/choose-track',
  profile: '/dashboard/profile',
  notifications: '/dashboard/notifications',
}

export function menteeSessionRoute(sessionId: string): string {
  return `${MENTEE_ROUTES.sessions}/${sessionId}`
}

export function menteeAttendanceRoute(sessionId: string): string {
  return `${MENTEE_ROUTES.sessions}/${sessionId}/attendance`
}

export function menteeExtensionRoute(sessionId: string): string {
  return `${MENTEE_ROUTES.sessions}/${sessionId}/extension`
}

export function menteeActivityFormRoute(kind: string): string {
  return `${MENTEE_ROUTES.activities}/new/${kind}`
}

export function menteeApplicationUpdateRoute(activityId: string): string {
  return `${MENTEE_ROUTES.activities}/${activityId}/update`
}

export function menteeNotesRoute(sessionId: string): string {
  return `${MENTEE_ROUTES.sessions}/${sessionId}/notes`
}
