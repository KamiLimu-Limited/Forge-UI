import type { ActivityStatus, OpportunityOutcome } from '@/types/activity'

// The five logs the mentee sees. The API has four types, so job and scholarship
// applications share "opportunity". See docs/api-gaps.md.
export type ActivityKind = 'consultation' | 'event' | 'job' | 'scholarship' | 'academic'

export interface ActivityTile {
  kind: ActivityKind
  // "Consultations"
  label: string
  count: number
  points: number
}

export interface ActivityLogRow {
  id: string
  kind: ActivityKind
  // "Job application"
  typeLabel: string
  details: string
  // YYYY-MM-DD
  date: string
  points: number
  status: ActivityStatus
  // Only applications still waiting for review can change
  canUpdate: boolean
}

export interface MenteeActivitiesData {
  totalPoints: number
  loggedCount: number
  tiles: ActivityTile[]
  recent: ActivityLogRow[]
}

export interface ApplicationView {
  id: string
  kind: 'job' | 'scholarship'
  title: string
  organization: string
  stage: OpportunityOutcome
  points: number
  canUpdate: boolean
}

export type FieldKind = 'text' | 'date' | 'textarea' | 'select' | 'segmented' | 'chips'

export interface FieldOption {
  value: string
  label: string
}

export interface ActivityField {
  name: string
  label: string
  kind: FieldKind
  placeholder?: string
  hint?: string
  options?: FieldOption[]
  // The value a segmented field starts on
  initial?: string
  // Takes half the row from md up
  half?: boolean
  // The API can't store this yet, so it is shown disabled
  unavailable?: boolean
}

export interface ActivityFormConfig {
  kind: ActivityKind
  title: string
  subtitle: string
  saveLabel: string
  fields: ActivityField[]
}

export type ActivityFormValues = Record<string, string>
