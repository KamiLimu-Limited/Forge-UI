import type { AlumniRecordTab } from '@/types/alumni'

// Alumni paths in one place, like lib/menteeRoutes.ts
export const ALUMNI_ROUTES = {
  home: '/dashboard/alumni',
  history: '/dashboard/alumni/history',
}

export function alumniHistoryRoute(tab: AlumniRecordTab): string {
  return tab === 'sessions' ? ALUMNI_ROUTES.history : `${ALUMNI_ROUTES.history}?view=${tab}`
}
