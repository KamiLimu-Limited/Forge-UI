// System Admin and Program Lead paths that are linked from more than one place
export const ADMIN_ROUTES = {
  home: '/admin',
  groupMeetings: '/admin/group-meetings',
  messages: '/admin/messages',
  emailDelivery: '/admin/email-delivery',
  googleSync: '/admin/google-sync',
}

export function meetUnmatchedRoute(sessionId: string): string {
  return `/admin/sessions/${sessionId}/meet`
}

export const PROGRAM_LEAD_ROUTES = {
  graduation: '/admin/graduation',
  revealOrder: '/admin/graduation/reveal-order',
  correction: '/admin/graduation/correction',
  trends: '/admin/trends',
  crossCohort: '/admin/cross-cohort',
  leaderboards: '/admin/leaderboards',
}

// The full-screen graduation sequence, outside the admin shell so it can be projected
export function graduationSequenceRoute(cohortId: string): string {
  return `/graduation/${cohortId}`
}
