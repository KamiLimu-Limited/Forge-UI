// Where a participant screen loads from: the active view's cohort, and the same cohort
// again when the view is a peer mentor's (see hooks/useParticipantRole.ts)
export interface ParticipantCohort {
  cohortId: string | null
  peerCohortId: string | null
}
