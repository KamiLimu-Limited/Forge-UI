// Professional mentor paths, like lib/menteeRoutes.ts
export const PRO_MENTOR_ROUTES = {
  home: '/dashboard',
  feedback: '/dashboard/mentor/feedback',
  resources: '/dashboard/mentor/resources',
}

export function proFeedbackRoute(sessionId: string): string {
  return `${PRO_MENTOR_ROUTES.feedback}?session=${sessionId}`
}

export function proResourcesRoute(sessionId: string): string {
  return `${PRO_MENTOR_ROUTES.resources}#session-${sessionId}`
}
