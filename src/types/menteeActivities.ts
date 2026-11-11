import type { ActivityStatus, FinalOutcome, OpportunityStage } from '@/types/activity'

// The five logs the mentee sees. A job application is the API's `opportunity` type.
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
  // Applications can move stage until they're reversed
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
  stage: OpportunityStage
  finalOutcome: FinalOutcome
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
  // Options loaded when the form opens instead of fixed ones
  optionsFrom?: 'consultants'
  // May be left empty
  optional?: boolean
}

export interface ActivityFormConfig {
  kind: ActivityKind
  title: string
  subtitle: string
  saveLabel: string
  fields: ActivityField[]
}

export type ActivityFormValues = Record<string, string>
