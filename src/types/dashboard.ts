// =============================================================================
// Dashboard types, mapped directly from the Forge API OpenAPI schema
// =============================================================================

export interface CohortHealthResponse {
  cohort_id: string
  total_mentees: number
  // Mentees per graduation status
  counts: Record<string, number>
  average_core_rate: number
  average_combined_rate: number
  pending_override_requests: number
  pending_activities: number
}
