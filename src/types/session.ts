// =============================================================================
// Session types, mapped directly from the Forge API OpenAPI schema
// =============================================================================

import type { PageParams } from '@/types/page'

export type SessionCategory = 'thursday' | 'saturday' | 'peer_mentorship'

export type SessionType = 'core' | 'ict' | 'professional' | 'peer_mentorship'

export type SessionMode = 'physical' | 'virtual' | 'hybrid'

export type SessionStatus = 'draft' | 'published' | 'cancelled' | 'completed'

export type MentorRole = 'lead' | 'co_mentor'

export type ResourceType = 'slides' | 'recording' | 'drive_folder' | 'document' | 'other'

export interface UserSummary {
  id: string
  email: string
  first_name: string
  last_name: string
}

export interface MentorAssignment {
  user_id: string
  mentor_role?: MentorRole
}

export interface ResourceIn {
  resource_type: ResourceType
  url: string
  description?: string | null
}

export interface SessionMentorResponse {
  mentor_role: MentorRole
  user: UserSummary
}

export interface SessionResourceResponse {
  id: string
  resource_type: ResourceType
  url: string
  description: string | null
}

export interface AttendanceWindowSummary {
  id: string
  opens_at: string
  closes_at: string
  is_active: boolean
}

export interface SessionResponse {
  id: string
  cohort_id: string
  title: string
  description: string | null
  kami_limu_month: number
  starts_at: string
  ends_at: string
  duration_minutes: number
  category: SessionCategory
  session_type: SessionType
  // ICT track name for ICT sessions, otherwise null
  track: string | null
  mode: SessionMode
  location: string | null
  points: number
  status: SessionStatus
  attendance_deadline: string | null
  original_starts_at: string | null
  mentors: SessionMentorResponse[]
  resources: SessionResourceResponse[]
}

export interface RescheduleEntry {
  from: string
  to: string
  reason: string | null
  by: string
  at: string
}

export interface SessionDetailResponse extends SessionResponse {
  reschedule_history: RescheduleEntry[] | null
  attendance_window: AttendanceWindowSummary | null
}

// The short form embedded in attendance records and override requests
export interface SessionBrief {
  id: string
  cohort_id: string
  title: string
  starts_at: string
  kami_limu_month: number
  category: SessionCategory
  session_type: SessionType
  track: string | null
  points: number
}

export interface SessionCreateRequest {
  cohort_id: string
  title: string
  starts_at: string
  duration_minutes: number
  category: SessionCategory
  session_type?: SessionType
  status?: 'draft' | 'published'
  description?: string | null
  kami_limu_month?: number | null
  track?: string | null
  mode?: SessionMode
  location?: string | null
  points?: number | null
  attendance_deadline?: string | null
  mentors?: MentorAssignment[]
  resources?: ResourceIn[]
}

export interface SessionUpdateRequest {
  title?: string | null
  description?: string | null
  kami_limu_month?: number | null
  track?: string | null
  mode?: SessionMode | null
  location?: string | null
  points?: number | null
  attendance_deadline?: string | null
  category?: SessionCategory | null
  session_type?: SessionType | null
  // Publish or complete only; cancel with DELETE
  status?: 'published' | 'completed' | null
}

export interface SessionRescheduleRequest {
  starts_at: string
  duration_minutes?: number | null
  reason?: string | null
}

export interface SessionCancelRequest {
  reason?: string | null
}

export interface MentorsUpdateRequest {
  mentors: MentorAssignment[]
}

export interface ResourcesUpdateRequest {
  resources: ResourceIn[]
}

export interface SessionListParams extends PageParams {
  cohort_id?: string
  track?: string
  kami_limu_month?: number
  status?: SessionStatus
  category?: SessionCategory
  session_type?: SessionType
  starts_after?: string
  starts_before?: string
}
