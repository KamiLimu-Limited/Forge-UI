// =============================================================================
// Skill rating types, mapped directly from the Forge API OpenAPI schema
// =============================================================================

export type RatingPoint = 'early' | 'mid' | 'late'

export interface SkillRatingResponse {
  id: string
  mentee_id: string
  cohort_id: string
  rating_point: RatingPoint
  // Skill name to a 1 to 5 rating
  ratings: Record<string, number>
  rated_at: string
}

export interface SkillProgressResponse {
  mentee_id: string
  cohort_id: string
  skill_names: string[]
  ratings: SkillRatingResponse[]
  // Latest minus earliest rating per skill
  change: Record<string, number>
}

export interface SkillRatingRequest {
  cohort_id?: string | null
  rating_point: RatingPoint
  // A rating for every skill on the cohort
  ratings: Record<string, number>
}

export interface SkillRatingWindowStatus {
  rating_point: RatingPoint
  opens_at: string | null
  closes_at: string | null
  is_open: boolean
  submitted: boolean
}
