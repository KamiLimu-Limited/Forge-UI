// Extra activity types, mapped directly from the Forge API OpenAPI schema

import type { PageParams } from '@/types/page'

// `opportunity` is a job application; scholarships and fellowships are their own type
export type ActivityType = 'academic' | 'event' | 'opportunity' | 'scholarship' | 'consultation'

// Points count from the moment a log is saved; a System Admin can reverse it with a reason
export type ActivityStatus = 'active' | 'reversed'

export type EventRole = 'participant' | 'speaker' | 'organizer'

export type EventMode = 'in_person' | 'virtual'

export type OpportunityStage =
  | 'applied'
  | 'general_interview'
  | 'technical_interview'
  | 'final_interview'
  | 'offer_made'

export type FinalOutcome =
  | 'waiting_for_response'
  | 'did_not_proceed'
  | 'offer_made_and_accepted'
  | 'offer_made_but_rejected'

export type ConsultationStatus = 'scheduled' | 'completed'

export interface AcademicDetails {
  kami_limu_pillar: string
  related_session_ids: string[]
  how_applied: string
}

export interface EventDetails {
  event_role: EventRole
  mode: EventMode
  learnings: string
}

// Job and scholarship applications share these details
export interface ApplicationDetails {
  organisation: string
  date_applied: string
  related_session_ids?: string[]
  how_applied: string
  stage?: OpportunityStage
  final_outcome?: FinalOutcome
}

export interface ConsultationDetails {
  consultation_type: string
  summary: string
  support_received?: string | null
  status?: ConsultationStatus
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
  consultant_id: string | null
  reversed_by: string | null
  reversed_at: string | null
  reversal_reason: string | null
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
  details: ApplicationDetails
}

export interface ScholarshipApplicationResponse extends ActivityBase {
  type: 'scholarship'
  details: ApplicationDetails
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
  | ScholarshipApplicationResponse
  | ConsultationSessionResponse

export interface ActivityReversalRequest {
  reason: string
}

export interface ActivityListParams extends PageParams {
  cohort_id?: string
  type?: ActivityType
  status?: ActivityStatus
  mentee_id?: string
}

interface ActivityRequestBase {
  cohort_id?: string | null
  title: string
  description?: string | null
  date: string
}

export interface AcademicActivityRequest extends ActivityRequestBase {
  details: AcademicDetails
}

export interface ExternalEventRequest extends ActivityRequestBase {
  details: EventDetails
}

export interface OpportunityApplicationRequest extends ActivityRequestBase {
  details: ApplicationDetails
}

export interface ScholarshipApplicationRequest extends ActivityRequestBase {
  details: ApplicationDetails
}

export interface ConsultationSessionRequest extends ActivityRequestBase {
  consultant_id: string
  details: ConsultationDetails
}

// Stage, outcome and consultation status changes recalculate the points
export interface ActivityUpdateRequest {
  title?: string | null
  description?: string | null
  date?: string | null
  consultant_id?: string | null
  details?: Record<string, unknown> | null
}

export interface ConsultantRequest {
  name: string
  email?: string | null
  organisation?: string | null
  // The consultation type they cover, such as Cybersecurity
  expertise?: string | null
}

export interface ConsultantResponse {
  id: string
  name: string
  email: string | null
  organisation: string | null
  expertise: string | null
  is_active: boolean
}
