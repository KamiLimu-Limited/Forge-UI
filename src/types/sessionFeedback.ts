// GET /sessions/{id}/feedback: what everyone who attended a session said about it, for
// staff and the session's own mentors. Respondents are anonymous ids, never names.

export interface FeedbackEntry {
  // A per-session pseudonym such as "Mentee-3fa9c2d1"
  respondent: string
  quality_rating: number | null
  usefulness_rating: number | null
  understanding_score: number | null
  feedback: string | null
}

export interface SessionFeedbackResponse {
  session_id: string
  responses: number
  // Keyed by rating field, for example quality_rating
  averages: Record<string, number | null>
  entries: FeedbackEntry[]
}
