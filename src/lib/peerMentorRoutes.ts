// Peer mentor paths in one place, like lib/menteeRoutes.ts
export const PEER_MENTOR_ROUTES = {
  home: '/dashboard',
  groupMeeting: '/dashboard/group-meeting',
  facilitator: '/dashboard/facilitator',
  leaderboards: '/dashboard/leaderboards',
}

export function peerMenteeRoute(menteeId: string): string {
  return `/dashboard/mentees/${menteeId}`
}

export function groupFeedbackRoute(sessionId: string): string {
  return `/dashboard/group-feedback/${sessionId}`
}

export function sessionRatingsRoute(sessionId: string): string {
  return `/dashboard/facilitator/${sessionId}`
}
