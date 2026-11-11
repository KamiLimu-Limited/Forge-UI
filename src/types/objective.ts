// Objective types, mapped directly from the Forge API OpenAPI schema

import type { RatingPoint } from '@/types/cohort'

export type { RatingPoint }

export type ObjectiveType = 'human' | 'technical'

export interface ObjectiveRatingResponse {
  rating_point: RatingPoint
  score: number
  rated_at: string
}

export interface ObjectiveResponse {
  id: string
  user_id: string
  cohort_id: string
  type: ObjectiveType
  text: string
  ratings: ObjectiveRatingResponse[]
  created_at: string
  updated_at: string
}

export interface ObjectiveCreateRequest {
  cohort_id?: string | null
  type: ObjectiveType
  text: string
}

export interface ObjectiveUpdateRequest {
  type?: ObjectiveType | null
  text?: string | null
}

export interface ObjectiveRatingRequest {
  rating_point: RatingPoint
  // 1 to 5
  score: number
}

export interface ObjectiveWindow {
  rating_point: RatingPoint
  opens_at: string | null
  closes_at: string | null
  is_open: boolean
}

export interface ObjectiveWindowsResponse {
  cohort_id: string
  windows: ObjectiveWindow[]
}
