// =============================================================================
// Extra activity types, mapped directly from the Forge API OpenAPI schema
// =============================================================================

import type { PageParams } from '@/types/page'

export type ActivityType = 'academic' | 'event' | 'opportunity' | 'consultation'

export type ActivityStatus = 'pending' | 'approved' | 'rejected'

export type EventRole = 'attendee' | 'speaker' | 'volunteer' | 'organizer' | 'panelist'

export type EventMode = 'physical' | 'virtual' | 'hybrid'

export type OpportunityOutcome = 'applied' | 'shortlisted' | 'accepted' | 'rejected'

export interface AcademicDetails {
  course_name: string
  related_session_ids: string[]
  kami_limu_pillar: string | null
}

export interface EventDetails {
  event_role: EventRole
  mode: EventMode
  organizer: string | null
  learnings: string
}

export interface OpportunityDetails {
  organization: string
  application_date: string
  outcome_status: OpportunityOutcome
}

export interface ConsultationDetails {
  mentor_id: string | null
  mentor_name: string | null
  consultation_date: string
  outcome: string
}

interface ActivityBase {
  id: string
  mentee_id: string
  cohort_id: string
  title: string
  description: string | null
  date: string
  status: ActivityStatus
  points_awarded: number
  reviewed_by: string | null
  reviewed_at: string | null
  review_reason: string | null
  created_at: string
  updated_at: string
}

export interface AcademicActivityResponse extends ActivityBase {
  type: 'academic'
  details: AcademicDetails
}

export interface ExternalEventResponse extends ActivityBase {
  type: 'event'
  details: EventDetails
}

export interface OpportunityApplicationResponse extends ActivityBase {
  type: 'opportunity'
  details: OpportunityDetails
}

export interface ConsultationSessionResponse extends ActivityBase {
  type: 'consultation'
  details: ConsultationDetails
}

// Discriminated on `type`
export type ExtraActivityResponse =
  | AcademicActivityResponse
  | ExternalEventResponse
  | OpportunityApplicationResponse
  | ConsultationSessionResponse

export interface ActivityReviewRequest {
  // Approval only
  points_awarded?: number | null
  reason?: string | null
}

export interface ActivityListParams extends PageParams {
  cohort_id?: string
  type?: ActivityType
  status?: ActivityStatus
  mentee_id?: string
}
