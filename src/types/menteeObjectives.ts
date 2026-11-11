import type { RatingPoint } from '@/types/objective'

export type ObjectiveGroup = 'Human' | 'Technical'

export interface ObjectiveRow {
  // The objective's id
  id: string
  label: string
  group: ObjectiveGroup
  scores: Record<RatingPoint, number | null>
}

export interface RatingWindowView {
  point: RatingPoint
  // "Start", "Mid" or "End"
  label: string
  isOpen: boolean
  // "2 Nov", or null when the date isn't set
  opensLabel: string | null
  // "Sun 7 Sep", or null when the date isn't set
  closesLabel: string | null
}

export interface MenteeObjectivesData {
  cohortId: string
  objectives: ObjectiveRow[]
  windows: RatingWindowView[]
  // The window the mentee can rate in now
  openWindow: RatingWindowView | null
}
