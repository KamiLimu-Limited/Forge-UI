// Peer mentor paths in one place, like lib/menteeRoutes.ts
export const PEER_MENTOR_ROUTES = {
  home: '/dashboard',
}

export function peerMenteeRoute(menteeId: string): string {
  return `/dashboard/mentees/${menteeId}`
}
